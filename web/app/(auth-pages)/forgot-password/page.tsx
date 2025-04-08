import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <>
      <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm space-y-10">

          <form className="">
            <div>
              <h1 className="text-2xl font-medium">Reset Password</h1>
              <p className="text-sm" >
                Already have an account?{" "}
                <Link className="text-secondary underline" href="/sign-in">
                  Sign in
                </Link>
              </p>
            </div>
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
              <Label htmlFor="email">Email</Label>
              <Input name="email" placeholder="you@example.com" required />
              <SubmitButton >
                Reset Password
              </SubmitButton>
              <FormMessage message={searchParams} />
            </div>
          </form>
          <SmtpMessage />
        </div >
      </div >
    </>
  );
}
