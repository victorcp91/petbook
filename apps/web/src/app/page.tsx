import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            PetBook
          </h1>
          <p className="text-xl mb-8">
            Livro Digital de Banho & Tosa
          </p>
          <Button size="lg">
            Começar Agora
          </Button>
        </div>
      </div>
    </main>
  )
} 