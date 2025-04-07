type LogoSize = 'sm' | 'md' | 'xl'

const sizeMap: Record<LogoSize, number> = {
  sm: 48,
  md: 64,
  xl: 100,
}

function LogoSvg({ size = 'md', ...props }: { size?: LogoSize } & React.ComponentPropsWithoutRef<'svg'>) {
  const dimension = sizeMap[size]
  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 39 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M0 33.15C0 36.3809 2.61913 39 5.85 39H33.15C36.3809 39 39 36.3809 39 33.15V31.2H33.2261C31.4159 31.2 30.0632 30.6132 29.1681 29.4396C28.2729 30.6132 26.9203 31.2 25.1101 31.2H22.1561C21.4599 31.2 20.8134 31.1038 20.2166 30.9114C19.6199 31.1038 18.9933 31.2 18.3368 31.2H0V33.15Z" fill="url(#paint0_linear_287_8)" />
      <path d="M0 29.4381L17.5909 29.4108C16.5167 28.3719 15.9796 27.0925 15.9796 25.5726C15.9796 24.4568 16.2482 23.5141 16.7853 22.7445C17.203 21.1477 17.9887 19.8875 19.1425 18.9641C20.3161 18.0214 21.6887 17.55 23.2601 17.55C25.2692 17.55 26.9402 18.233 28.2729 19.5989C29.5261 20.9072 30.1527 22.5714 30.1527 24.5914V26.1209C30.1527 28.3142 31.2568 29.4108 33.4648 29.4108H39V5.85C39 2.61913 36.3809 0 33.15 0H5.85C2.61913 0 0 2.61913 0 5.85V29.4381Z" fill="url(#paint1_linear_287_8)" />
      <path d="M28.1834 26.0055C28.1834 28.2757 27.1093 29.4108 24.9609 29.4108H22.8722C23.9464 28.3719 24.4835 27.0925 24.4835 25.5726C24.4835 24.2259 24.0956 23.1485 23.3198 22.3405C22.544 21.5132 21.5196 21.0996 20.2465 21.0996C19.9481 21.0996 19.6497 21.1284 19.3513 21.1862C20.2266 19.9356 21.4997 19.3104 23.1706 19.3104C24.4238 19.3104 25.5179 19.7048 26.4528 20.4936C27.6066 21.494 28.1834 22.8599 28.1834 24.5914V26.0055Z" fill="url(#paint2_linear_287_8)" />
      <path d="M22.9618 25.5149C22.9618 27.3618 22.0567 28.5739 20.2465 29.1511C18.4164 28.5739 17.5014 27.3618 17.5014 25.5149C17.5014 24.5914 17.75 23.8604 18.2473 23.3217C18.7446 22.783 19.411 22.5136 20.2465 22.5136C21.0819 22.5136 21.7384 22.7926 22.2158 23.3505C22.7131 23.8892 22.9618 24.6107 22.9618 25.5149Z" fill="url(#paint3_linear_287_8)" />
      <defs>
        <linearGradient id="paint0_linear_287_8" x1="1.4625" y1="37.5375" x2="39" y2="3.4125" gradientUnits="userSpaceOnUse">
          <stop offset="0.33" stopColor="#2BC9F3" />
          <stop offset="1" stopColor="#72F8D5" />
        </linearGradient>
        <linearGradient id="paint1_linear_287_8" x1="1.4625" y1="37.5375" x2="39" y2="3.4125" gradientUnits="userSpaceOnUse">
          <stop offset="0.33" stopColor="#2BC9F3" />
          <stop offset="1" stopColor="#72F8D5" />
        </linearGradient>
        <linearGradient id="paint2_linear_287_8" x1="1.4625" y1="37.5375" x2="39" y2="3.4125" gradientUnits="userSpaceOnUse">
          <stop offset="0.33" stopColor="#2BC9F3" />
          <stop offset="1" stopColor="#72F8D5" />
        </linearGradient>
        <linearGradient id="paint3_linear_287_8" x1="1.4625" y1="37.5375" x2="39" y2="3.4125" gradientUnits="userSpaceOnUse">
          <stop offset="0.33" stopColor="#2BC9F3" />
          <stop offset="1" stopColor="#72F8D5" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function Logo({ size = 'sm', className }: { size?: LogoSize; className?: string }) {
  const fontSizeMap: Record<LogoSize, string> = {
    sm: 'text-sm',
    md: 'text-2xl',
    xl: 'text-5xl',
  }

  return (
    <div className={`flex items-center justify-center gap-8 ${className}`}>
      <LogoSvg size={size} />
      <span className={`font-maven-pro font-medium ${fontSizeMap[size]}`}>Maham</span>
    </div>
  )
}
