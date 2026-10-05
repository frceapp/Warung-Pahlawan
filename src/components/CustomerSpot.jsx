import CharacterAvatar from './CharacterAvatar.jsx'
import SpeechBubble from './SpeechBubble.jsx'

// Pembeli dan balon bicaranya.
// `large`: tampilan penuh untuk langkah Sapa (avatar besar, fun fact).
// Selain itu ringkas: avatar kecil di samping balon bicara pendek.
function CustomerSpot({ character, large = false, children }) {
  if (large) {
    return (
      <div className="flex flex-col items-center gap-3 md:flex-row md:items-start md:gap-6">
        <div className="flex shrink-0 flex-col items-center gap-1 text-center motion-safe:animate-arrive">
          <CharacterAvatar
            characterId={character.id}
            size={160}
            decorative
            className="h-28 w-28 md:h-40 md:w-40"
          />
          <p className="rounded-lg border-4 border-tinta bg-terpal-tua px-2 py-0.5 font-heading text-base leading-tight text-kapur">
            {character.name}
          </p>
          <p className="text-sm leading-tight">{character.origin}</p>
        </div>
        <SpeechBubble tail="top" className="w-full md:mt-2 md:flex-1">
          {children}
        </SpeechBubble>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 md:gap-4">
      <div className="flex w-16 shrink-0 flex-col items-center md:w-20">
        <CharacterAvatar
          characterId={character.id}
          size={96}
          decorative
          className="h-11 w-11 md:h-16 md:w-16"
        />
        <p className="mt-0.5 line-clamp-2 text-center text-[11px] leading-tight font-bold md:text-sm">
          {character.name}
        </p>
      </div>
      <SpeechBubble className="min-w-0 flex-1" compact>
        {children}
      </SpeechBubble>
    </div>
  )
}

export default CustomerSpot
