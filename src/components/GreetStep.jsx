import Button from './Button.jsx'

// Langkah 1: pembeli datang dan bercerita. Anak mulai melayani.
function GreetStep({ customerName, onStart }) {
  return (
    <div className="flex flex-col items-start gap-4">
      <p className="text-lg">{customerName} datang ke warungmu. Baca ceritanya dulu, ya.</p>
      <Button onClick={onStart}>Mulai melayani</Button>
    </div>
  )
}

export default GreetStep
