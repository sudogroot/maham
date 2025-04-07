import Image from 'next/image'

import { Button } from './Button'
import { Container } from './Container'
import backgroundImage from '@/images/background-call-to-action.jpg'
import { BlobBg } from './bg-blobs'
import { MoveRight } from 'lucide-react'

export function CallToAction() {
  return (
    <section
      id="get-started-today"
      className="relative overflow-hidden bg-cyan-900 py-32"
    >
      <BlobBg size="60%" />
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display font-semibold text-4xl tracking-tight text-white sm:text-4xl">
            Get started today
          </h2>
          <p className="mt-4 text-xl tracking-tight text-white">
            It’s time to take control of your books. Buy our software so you can
            feel like you’re doing something productive.
          </p>
          <Button href="/register" color="cyan" className="mt-10 w-[250px] h-[60px] " >
            <span className="text-2xl font-semibold pr-4">Get started </span> <MoveRight className='font-semibold' />
          </Button>
        </div>
      </Container>
    </section>
  )
}
