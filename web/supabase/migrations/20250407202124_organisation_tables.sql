-- Create organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
);

-- Create organization_members junction table with expanded roles
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'external', 'guest', 'client')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Create invitations table with expanded roles
CREATE TABLE organization_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'external', 'guest', 'client')),
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, email)
);

-- Create RLS (Row Level Security) policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_invitations ENABLE ROW LEVEL SECURITY;

-- Create functions needed for policies
-- Is organization admin or owner
CREATE OR REPLACE FUNCTION is_organization_admin_or_owner(org_id UUID) 
RETURNS BOOLEAN AS $$
DECLARE
  is_admin_or_owner BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 
    FROM organization_members 
    WHERE organization_id = org_id 
    AND user_id = auth.uid() 
    AND role IN ('admin', 'owner')
  ) INTO is_admin_or_owner;
  
  RETURN is_admin_or_owner;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Is organization owner
CREATE OR REPLACE FUNCTION is_organization_owner(org_id UUID) 
RETURNS BOOLEAN AS $$
DECLARE
  is_owner BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 
    FROM organization_members 
    WHERE organization_id = org_id 
    AND user_id = auth.uid() 
    AND role = 'owner'
  ) INTO is_owner;
  
  RETURN is_owner;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Organizations policies
-- Anyone can create organizations
CREATE POLICY "Users can create organizations" 
  ON organizations 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Users can view organizations they are members of (including all role types)
CREATE POLICY "Users can view their organizations" 
  ON organizations 
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 
      FROM organization_members 
      WHERE organization_id = organizations.id 
      AND user_id = auth.uid()
    )
  );

-- Only organization admins and owners can update organizations
CREATE POLICY "Admins and owners can update organizations" 
  ON organizations 
  FOR UPDATE 
  TO authenticated 
  USING (is_organization_admin_or_owner(id))
  WITH CHECK (is_organization_admin_or_owner(id));

-- Only organization owners can delete organizations
CREATE POLICY "Only owners can delete organizations" 
  ON organizations 
  FOR DELETE 
  TO authenticated 
  USING (is_organization_owner(id));

-- Organization members policies
-- Users can view members in their organizations
CREATE POLICY "Users can view members in their organizations" 
  ON organization_members 
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 
      FROM organization_members om
      WHERE om.organization_id = organization_members.organization_id 
      AND om.user_id = auth.uid()
    )
  );

-- Only admins and owners can add members
CREATE POLICY "Admins and owners can add members to organizations" 
  ON organization_members 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (is_organization_admin_or_owner(organization_id));

-- Only admins and owners can update members, but owners cannot be demoted except by themselves
CREATE POLICY "Admins and owners can update organization members" 
  ON organization_members 
  FOR UPDATE 
  TO authenticated 
  USING (
    is_organization_admin_or_owner(organization_id) AND
    (
      -- If updating an owner, must be the owner themselves
      (OLD.role = 'owner' AND OLD.user_id = auth.uid()) OR
      -- Anyone else can be updated by any admin or owner
      (OLD.role != 'owner')
    )
  )
  WITH CHECK (
    is_organization_admin_or_owner(organization_id) AND
    (
      -- Only owners can promote to owner
      (NEW.role = 'owner' AND is_organization_owner(organization_id)) OR
      -- Admins and owners can set any other role
      (NEW.role != 'owner')
    )
  );

-- Only admins and owners can remove members, but owners cannot be removed except by themselves
CREATE POLICY "Admins and owners can remove organization members" 
  ON organization_members 
  FOR DELETE 
  TO authenticated 
  USING (
    is_organization_admin_or_owner(organization_id) AND
    (
      -- If deleting an owner, must be the owner themselves
      (role = 'owner' AND user_id = auth.uid()) OR
      -- Anyone else can be deleted by any admin or owner
      (role != 'owner')
    )
  );

-- Special policy: users can leave organizations (delete themselves)
CREATE POLICY "Users can leave organizations" 
  ON organization_members 
  FOR DELETE 
  TO authenticated 
  USING (user_id = auth.uid());

-- Organization invitations policies
-- Only organization admins and owners can create invitations
CREATE POLICY "Admins and owners can send invitations" 
  ON organization_invitations 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    is_organization_admin_or_owner(organization_id) AND
    (
      -- Only owners can invite owners
      (NEW.role = 'owner' AND is_organization_owner(organization_id)) OR
      -- Admins and owners can invite any other role
      (NEW.role != 'owner')
    )
  );

-- Admins and owners can view invitations for their organizations
CREATE POLICY "Admins and owners can view invitations" 
  ON organization_invitations 
  FOR SELECT 
  TO authenticated 
  USING (is_organization_admin_or_owner(organization_id));

-- Admins and owners can delete invitations
CREATE POLICY "Admins and owners can delete invitations" 
  ON organization_invitations 
  FOR DELETE 
  TO authenticated 
  USING (is_organization_admin_or_owner(organization_id));

-- Create triggers for automatically adding the creator as owner
CREATE OR REPLACE FUNCTION add_organization_creator_as_owner()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO organization_members (organization_id, user_id, role)
  VALUES (NEW.id, auth.uid(), 'owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_organization_created
  AFTER INSERT ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION add_organization_creator_as_owner();

-- Create indexes for performance
CREATE INDEX idx_organization_members_organization_id ON organization_members(organization_id);
CREATE INDEX idx_organization_members_user_id ON organization_members(user_id);
CREATE INDEX idx_organization_members_role ON organization_members(role);
CREATE INDEX idx_organization_invitations_organization_id ON organization_invitations(organization_id);
CREATE INDEX idx_organization_invitations_email ON organization_invitations(email);
