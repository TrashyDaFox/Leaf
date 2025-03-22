import { world, system } from "@minecraft/server"

function adjustTextLength(text = '', totalLength = 100) {
  return (text.slice(0, totalLength)).padEnd(totalLength, '\t')
}

// §N§O§T§I§F§I§C§A§T§I§O§N is the flag, you can change it, just dont forget to change it in your _global_variables.json
//                    these are the defaults, you can change it
export function dynamicToast(title = '', message = '', icon = '', background = 'textures/ui/greyBorder') {
  return "§N§O§T§I§F§I§C§A§T§I§O§N" + adjustTextLength(title, 100) + adjustTextLength(message, 200) + adjustTextLength(icon, 100) + adjustTextLength(background, 100)
}