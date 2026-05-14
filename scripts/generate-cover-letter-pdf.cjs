const fs = require('fs')
const path = require('path')
const { PDFDocument, StandardFonts, rgb } = require('/Users/clawdbot/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pdf-lib')

const outPath = path.resolve('public/resume/obadiah-lord-cover-letter.pdf')
const imagePath = path.resolve('public/images/portrait.png')

const letter = {
  name: 'Obadiah Lord',
  headline: 'Sales Professional | Dealership Experience | Tech Sales | AI Software',
  contact: 'Las Vegas, NV | 702 319 2911 | obadiahbusiness@gmail.com',
  greeting: 'Dear Hiring Manager,',
  paragraphs: [
    'I am writing to express my interest in sales opportunities with your dealership. My background combines hands-on automotive sales experience with newer experience in tech sales, giving me a strong understanding of customer communication, follow-up, urgency, and how to move people from interest to action.',
    'I have worked in dealership environments across Dodge, Chevrolet, and Mercedes-Benz, where I learned how to build trust quickly, stay consistent with follow-up, and maintain production in both mainstream and premium settings. I also worked in tech sales at LeadPilot AI, selling dealership-focused software built around lead response, automation, and customer communication. That experience gave me a practical understanding of how modern tools can support a dealership without replacing the human side of the sale.',
    'What I would bring to your team is a steady work ethic, strong communication, real dealership familiarity, and the ability to connect with customers in a direct and professional way. I understand the pace of the business, the importance of responsiveness, and the value of staying disciplined every day.',
    'Thank you for your time and consideration. I would welcome the opportunity to speak further about how I can contribute to your dealership team.',
  ],
  closing: 'Sincerely,',
}

function wrapText(text, font, size, maxWidth) {
  const words = text.split(/\s+/)
  const lines = []
  let line = ''

  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (font.widthOfTextAtSize(test, size) <= maxWidth) {
      line = test
    } else {
      if (line) lines.push(line)
      line = word
    }
  }

  if (line) lines.push(line)
  return lines
}

function drawWrapped(page, text, x, y, maxWidth, options) {
  const { font, size, color, lineHeight } = options
  for (const line of wrapText(text, font, size, maxWidth)) {
    page.drawText(line, { x, y, size, font, color })
    y -= lineHeight
  }
  return y
}

async function main() {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([612, 792])

  const fonts = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
    name: await pdf.embedFont(StandardFonts.TimesRoman),
  }

  const portraitImage = await pdf.embedPng(fs.readFileSync(imagePath))
  const portrait = {
    width: 282,
    height: (282 * portraitImage.height) / portraitImage.width,
  }

  const colors = {
    black: rgb(0.055, 0.055, 0.055),
    gray: rgb(0.27, 0.27, 0.27),
    lightGray: rgb(0.62, 0.62, 0.62),
    accent: rgb(0.77, 0.61, 0.25),
    pale: rgb(0.985, 0.985, 0.975),
  }

  page.drawRectangle({ x: 0, y: 0, width: 612, height: 792, color: rgb(1, 1, 1) })
  page.drawRectangle({ x: 0, y: 0, width: 28, height: 792, color: colors.black, opacity: 0.96 })
  page.drawRectangle({ x: 28, y: 0, width: 7, height: 792, color: colors.accent, opacity: 0.72 })
  page.drawImage(portraitImage, {
    x: 326,
    y: 470,
    width: portrait.width,
    height: portrait.height,
    opacity: 0.082,
  })

  const margin = 50
  let y = 733

  page.drawText(letter.name.split(' ')[0], { x: margin, y, size: 42, font: fonts.name, color: colors.black })
  y -= 42
  page.drawText(letter.name.split(' ')[1], { x: margin, y, size: 42, font: fonts.name, color: colors.black })
  y -= 20
  page.drawText(letter.headline, { x: margin, y, size: 11.2, font: fonts.bold, color: colors.black })
  y -= 17
  page.drawText(letter.contact, { x: margin, y, size: 9.2, font: fonts.regular, color: colors.gray })
  y -= 18
  page.drawLine({ start: { x: margin, y: y - 10 }, end: { x: 574, y: y - 10 }, thickness: 1.1, color: colors.black })
  page.drawLine({ start: { x: margin, y: y - 14 }, end: { x: 218, y: y - 14 }, thickness: 2.2, color: colors.accent })

  const bodyX = 74
  const bodyW = 454
  let bodyY = y - 42

  page.drawRectangle({
    x: bodyX - 18,
    y: 98,
    width: bodyW + 36,
    height: bodyY - 84,
    color: colors.pale,
  })

  page.drawText(letter.greeting, { x: bodyX, y: bodyY, size: 10.4, font: fonts.bold, color: colors.black })
  bodyY -= 26

  for (const paragraph of letter.paragraphs) {
    bodyY = drawWrapped(page, paragraph, bodyX, bodyY, bodyW, {
      font: fonts.regular,
      size: 10.1,
      color: colors.gray,
      lineHeight: 15,
    })
    bodyY -= 14
  }

  page.drawText(letter.closing, { x: bodyX, y: bodyY, size: 10.2, font: fonts.regular, color: colors.black })
  bodyY -= 28
  page.drawText(letter.name, { x: bodyX, y: bodyY, size: 12.2, font: fonts.bold, color: colors.black })

  fs.writeFileSync(outPath, await pdf.save())
  console.log(outPath)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
