import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import About from '@/components/About'
import QuoteBlock from '@/components/QuoteBlock'
import Axle from '@/components/Axle'
import FoundersCircle from '@/components/FoundersCircle'
import Footer from '@/components/Footer'
import RippleBackground from '@/components/RippleBackground'
import Cursor from '@/components/Cursor'
import MiniGame from '@/components/MiniGame'

export default function Home() {
  return (
    <>
      <RippleBackground />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />

        <MiniGame />

        <Axle />

        <QuoteBlock
          id="quote-2"
          img="/images/quote-1.jpg"
          alt="Obadiah Lord — AI agents are not just tools, they are the autonomous architects of efficiency"
          plate="Plate 02"
          eyebrow="On the work"
          quote={
            <>
              A tool executes what you hand it. An architect{' '}
              <strong className="font-medium">owns the outcome</strong>. The agents we are building
              do not wait for instructions on every step. They hold the goal, read the environment,
              and decide what comes next. That is the gap between software that assists and software
              that <strong className="font-medium">actually gets things done</strong>.
            </>
          }
          attribution="Obadiah Lord, Builder"
        />


        <FoundersCircle />
        <Footer />
      </main>
    </>
  )
}
