const fs = require('fs')
const path = require('path')
const { PDFDocument, StandardFonts, rgb } = require('/Users/clawdbot/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pdf-lib')

const outPath = path.resolve('public/resume/obadiah-lord-resume.pdf')
const imagePath = path.resolve('public/images/portrait.png')

const resume = {
  name: 'Obadiah Lord',
  headline: 'Sales Professional | Dealership Experience | Tech Sales | AI Software',
  contact: 'Las Vegas, NV | 702 319 2911 | obadiahbusiness@gmail.com',
  summary:
    'Sales professional with experience across domestic, luxury, and dealership software environments. Background includes Dodge, Chevrolet, Mercedes-Benz, and LeadPilot AI, where I worked in tech sales selling dealership AI software for sales follow-up, email, text automation, and workflow support.',
  highlights: [
    'Mercedes-Benz average: 15 vehicles per month',
    'Chevrolet average: 21 vehicles per month',
    'Dodge average: 18 vehicles per month',
    'Cross-industry background in dealership sales and AI software',
  ],
  skills: [
    'Quota-driven automotive sales',
    'Lead follow-up and appointment setting',
    'CRM and pipeline management',
    'Negotiation and closing',
    'Customer retention and referrals',
    'BDC and internet sales support',
    'Remote tech sales',
    'AI software demos and positioning',
    'Automation workflow design',
    'Prompt writing and AI-assisted communication',
  ],
  training: [
    {
      provider: 'Andy Elliott',
      program: 'Elliott247 Online Training Platform',
      details: 'Sales, closing, overcoming objections, phone skills, mindset, and marketing training.',
    },
    {
      provider: 'Jeremy Miner / 7th Level',
      program: 'NEPQ Virtual Sales Training',
      details: 'Neuro-Emotional Persuasion Questioning, objection prevention, and behavior-based sales communication.',
    },
  ],
  roles: [
    {
      company: 'LeadPilot AI',
      title: 'Tech Sales',
      dates: 'Apr 2024 - Apr 2026',
      location: 'Remote',
      bullets: [
        'Sold dealership AI software built around lead response, follow-up automation, and customer communication for dealership sales teams.',
        'Helped dealers understand how automated lead handling, CRM-connected follow-up, and AI-assisted messaging could reduce response lag and improve showroom opportunities.',
        'Worked at the intersection of dealership operations and modern software, translating AI tools into practical sales value for dealership decision-makers.',
        'Worked remotely in a startup environment where communication, accountability, and adaptability mattered daily.',
      ],
    },
    {
      company: 'Mercedes-Benz',
      title: 'Sales Professional',
      dates: 'Jan 2020 - Mar 2024',
      location: 'Dublin, OH',
      bullets: [
        'Averaged 15 vehicles sold per month while operating in a premium dealership environment that required polish, patience, and follow-through.',
        'Maintained strong month-to-month production while balancing customer needs, internal process, and sales goals in a premium brand setting.',
        'Built repeat business and referral potential through consistent follow-up, product knowledge, and a high-touch customer experience.',
        'Strengthened communication habits with buyers who expected clarity and professionalism at every step.',
      ],
    },
    {
      company: 'Chevrolet',
      title: 'Sales Professional',
      dates: 'Sep 2018 - Dec 2019',
      location: 'Columbus, OH',
      bullets: [
        'Averaged 21 vehicles sold per month in a Chevrolet environment and handled customer conversations with steady follow-up.',
        'Built a strong sales rhythm through clear communication, dependable response time, and consistent customer engagement.',
        'Helped move buyers from inquiry to showroom to close through disciplined outreach and follow-up.',
        'Built practical dealership experience that translated well to mainstream sales and service-driven teams.',
      ],
    },
    {
      company: 'Dodge',
      title: 'Sales Professional',
      dates: 'Jul 2016 - Aug 2018',
      location: 'Columbus, OH',
      bullets: [
        'Averaged 18 vehicles sold per month while learning the pace, expectations, and discipline required to stay productive.',
        'Built early production consistency through direct customer communication, follow-up, and day-to-day sales discipline.',
        'Built early lead handling and trust-building habits that translated well into later high-volume and premium dealership environments.',
        'Developed the customer communication and closing discipline that supported later dealership and software sales roles.',
      ],
    },
  ],
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
  const lines = wrapText(text, font, size, maxWidth)
  for (const line of lines) {
    page.drawText(line, { x, y, size, font, color })
    y -= lineHeight
  }
  return y
}

function drawSectionTitle(page, title, x, y, width, fonts, accent) {
  page.drawText(title.toUpperCase(), {
    x,
    y,
    size: 8.8,
    font: fonts.bold,
    color: rgb(0.14, 0.14, 0.14),
    characterSpacing: 1.2,
  })
  page.drawRectangle({ x, y: y - 11, width: 22, height: 1.7, color: accent })
  page.drawLine({
    start: { x: x + 28, y: y - 10 },
    end: { x: x + width, y: y - 10 },
    thickness: 0.7,
    color: rgb(0.76, 0.76, 0.76),
  })
  return y - 28
}

function drawPageChrome(page, colors) {
  page.drawRectangle({ x: 0, y: 0, width: 612, height: 792, color: rgb(1, 1, 1) })
  page.drawRectangle({ x: 0, y: 0, width: 28, height: 792, color: colors.black, opacity: 0.96 })
  page.drawRectangle({ x: 28, y: 0, width: 7, height: 792, color: colors.accent, opacity: 0.72 })
}

function drawHeader(page, fonts, colors, portrait, opts = {}) {
  const margin = 50
  let y = opts.compact ? 734 : 733

  page.drawImage(portrait.image, {
    x: opts.imageX ?? 312,
    y: opts.imageY ?? 486,
    width: portrait.width,
    height: portrait.height,
    opacity: opts.imageOpacity ?? 0.095,
  })

  page.drawText('Obadiah', { x: margin, y, size: 44, font: fonts.name, color: colors.black })
  y -= 44
  page.drawText('Lord', { x: margin, y, size: 44, font: fonts.name, color: colors.black })
  y -= 21
  page.drawText(resume.headline, { x: margin, y, size: 11.2, font: fonts.bold, color: colors.black })
  y -= 17
  page.drawText(resume.contact, { x: margin, y, size: 9.2, font: fonts.regular, color: colors.gray })
  y -= 21

  if (!opts.compact) {
    y = drawWrapped(page, resume.summary, margin, y, 378, {
      font: fonts.regular,
      size: 9.7,
      color: colors.gray,
      lineHeight: 13.1,
    })
    page.drawLine({
      start: { x: margin, y: y - 15 },
      end: { x: 574, y: y - 15 },
      thickness: 1.1,
      color: colors.black,
    })
    page.drawLine({
      start: { x: margin, y: y - 19 },
      end: { x: 210, y: y - 19 },
      thickness: 2.2,
      color: colors.accent,
    })
    return y - 47
  }

  page.drawLine({
    start: { x: margin, y: y - 10 },
    end: { x: 574, y: y - 10 },
    thickness: 1.1,
    color: colors.black,
  })
  page.drawLine({
    start: { x: margin, y: y - 14 },
    end: { x: 170, y: y - 14 },
    thickness: 2.2,
    color: colors.accent,
  })
  return y - 36
}

function drawContinuationHeader(page, fonts, colors) {
  const margin = 50
  const y = 736

  page.drawText('Experience, continued', {
    x: margin,
    y,
    size: 12.5,
    font: fonts.bold,
    color: colors.black,
  })
  page.drawText('Page 2', {
    x: 532,
    y,
    size: 9,
    font: fonts.regular,
    color: colors.lightGray,
  })
  page.drawLine({
    start: { x: margin, y: y - 10 },
    end: { x: 574, y: y - 10 },
    thickness: 1.1,
    color: colors.black,
  })
  page.drawLine({
    start: { x: margin, y: y - 14 },
    end: { x: 190, y: y - 14 },
    thickness: 2.2,
    color: colors.accent,
  })
  return y - 40
}

function drawSidebar(page, fonts, colors, startY) {
  const leftX = 50
  const leftW = 178
  let leftY = startY

  page.drawRectangle({
    x: leftX - 12,
    y: 108,
    width: leftW + 24,
    height: leftY - 100,
    color: rgb(0.985, 0.985, 0.975),
  })

  leftY = drawSectionTitle(page, 'Selected Performance', leftX, leftY, leftW, fonts, colors.accent)
  for (const item of resume.highlights) {
    page.drawCircle({ x: leftX + 2, y: leftY + 3, size: 1.65, color: colors.accent })
    leftY = drawWrapped(page, item, leftX + 10, leftY, leftW - 10, {
      font: fonts.regular,
      size: 8.85,
      color: colors.gray,
      lineHeight: 11.2,
    })
    leftY -= 4
  }

  leftY -= 14
  leftY = drawSectionTitle(page, 'Core Skills', leftX, leftY, leftW, fonts, colors.accent)
  for (const skill of resume.skills) {
    page.drawCircle({ x: leftX + 2, y: leftY + 3, size: 1.65, color: colors.accent })
    leftY = drawWrapped(page, skill, leftX + 10, leftY, leftW - 10, {
      font: fonts.regular,
      size: 8.75,
      color: colors.gray,
      lineHeight: 11.2,
    })
    leftY -= 3.5
  }

  leftY -= 14
  leftY = drawSectionTitle(page, 'Profile', leftX, leftY, leftW, fonts, colors.accent)
  drawWrapped(
    page,
    'Consistent, coachable, customer-facing, and comfortable translating modern tools into practical dealership value.',
    leftX,
    leftY,
    leftW,
    { font: fonts.regular, size: 8.9, color: colors.gray, lineHeight: 12 },
  )
}

function drawContinuationSidebar(page, fonts, colors, startY) {
  const x = 50
  const width = 178
  let y = startY

  page.drawRectangle({
    x: x - 12,
    y: 118,
    width: width + 24,
    height: y - 108,
    color: rgb(0.985, 0.985, 0.975),
  })

  y = drawSectionTitle(page, 'Strengths', x, y, width, fonts, colors.accent)

  const points = [
    'AI-native communicator with real dealership sales experience.',
    'Comfortable in showroom, follow-up, and software-driven sales environments.',
    'Strong volume history across luxury and mainstream brands.',
  ]

  for (const point of points) {
    page.drawCircle({ x: x + 2, y: y + 3, size: 1.65, color: colors.accent })
    y = drawWrapped(page, point, x + 10, y, width - 10, {
      font: fonts.regular,
      size: 8.85,
      color: colors.gray,
      lineHeight: 11.4,
    })
    y -= 5
  }

  y -= 10
  y = drawSectionTitle(page, 'Focus', x, y, width, fonts, colors.accent)
  drawWrapped(
    page,
    'Brings the mix of production, follow-up discipline, and modern AI fluency that dealerships can actually use.',
    x,
    y,
    width,
    {
      font: fonts.regular,
      size: 8.9,
      color: colors.gray,
      lineHeight: 11.8,
    },
  )
}

function drawRoles(page, roles, fonts, colors, startY) {
  const rightX = 252
  const rightW = 322
  let rightY = startY

  rightY = drawSectionTitle(page, 'Experience', rightX, rightY, rightW, fonts, colors.accent)

  for (const [index, role] of roles.entries()) {
    if (index > 0) {
      page.drawLine({
        start: { x: rightX, y: rightY + 6 },
        end: { x: rightX + rightW, y: rightY + 6 },
        thickness: 0.45,
        color: rgb(0.87, 0.87, 0.87),
      })
      rightY -= 5
    }

    page.drawRectangle({
      x: rightX - 13,
      y: rightY - 1,
      width: 4,
      height: 18,
      color: index === 0 ? colors.accent : rgb(0.78, 0.78, 0.78),
    })
    page.drawText(role.company, { x: rightX, y: rightY, size: 15.3, font: fonts.bold, color: colors.black })
    const dateW = fonts.bold.widthOfTextAtSize(role.dates, 8.8)
    page.drawText(role.dates, { x: rightX + rightW - dateW, y: rightY + 1.5, size: 8.8, font: fonts.bold, color: colors.gray })
    rightY -= 15
    page.drawText(role.title, { x: rightX, y: rightY, size: 9.5, font: fonts.bold, color: colors.gray })
    const locW = fonts.regular.widthOfTextAtSize(role.location, 8.7)
    page.drawText(role.location, { x: rightX + rightW - locW, y: rightY, size: 8.7, font: fonts.regular, color: colors.lightGray })
    rightY -= 15

    for (const bullet of role.bullets) {
      page.drawText('-', { x: rightX, y: rightY, size: 9, font: fonts.bold, color: colors.black })
      rightY = drawWrapped(page, bullet, rightX + 11, rightY, rightW - 11, {
        font: fonts.regular,
        size: 8.85,
        color: colors.gray,
        lineHeight: 11.5,
      })
      rightY -= 3.4
    }
    rightY -= 10
  }

  return rightY
}

function drawTraining(page, fonts, colors, startY) {
  const x = 252
  const width = 322
  let y = startY - 18

  y = drawSectionTitle(page, 'Education / Training', x, y, width, fonts, colors.accent)

  for (const item of resume.training) {
    page.drawRectangle({
      x: x - 13,
      y: y - 1,
      width: 4,
      height: 18,
      color: rgb(0.78, 0.78, 0.78),
    })
    page.drawText(item.provider, { x, y, size: 13.2, font: fonts.bold, color: colors.black })
    y -= 14
    page.drawText(item.program, { x, y, size: 9.2, font: fonts.bold, color: colors.gray })
    y -= 14
    y = drawWrapped(page, item.details, x, y, width, {
      font: fonts.regular,
      size: 8.8,
      color: colors.gray,
      lineHeight: 11.4,
    })
    y -= 12
  }

  return y
}

function drawClosingSummary(page, fonts, colors, startY) {
  const x = 252
  const width = 322
  let y = startY - 6

  y = drawSectionTitle(page, 'Summary', x, y, width, fonts, colors.accent)
  drawWrapped(
    page,
    'AI-native sales professional with real car industry experience across Dodge, Chevrolet, Mercedes-Benz, and dealership-focused software. Brings proven showroom production, strong follow-up discipline, and the ability to connect modern tools to real sales outcomes.',
    x,
    y,
    width,
    {
      font: fonts.regular,
      size: 8.95,
      color: colors.gray,
      lineHeight: 11.8,
    },
  )
}

async function main() {
  const pdf = await PDFDocument.create()
  const fonts = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
    name: await pdf.embedFont(StandardFonts.TimesRoman),
  }

  const portraitImage = await pdf.embedPng(fs.readFileSync(imagePath))
  const portrait = {
    image: portraitImage,
    width: 288,
    height: (288 * portraitImage.height) / portraitImage.width,
  }

  const colors = {
    black: rgb(0.055, 0.055, 0.055),
    gray: rgb(0.27, 0.27, 0.27),
    lightGray: rgb(0.62, 0.62, 0.62),
    accent: rgb(0.77, 0.61, 0.25),
  }

  const page1 = pdf.addPage([612, 792])
  drawPageChrome(page1, colors)
  const page1StartY = drawHeader(page1, fonts, colors, portrait, { imageX: 312, imageY: 486, imageOpacity: 0.095 })
  drawSidebar(page1, fonts, colors, page1StartY)
  drawRoles(page1, resume.roles.slice(0, 3), fonts, colors, page1StartY)

  const page2 = pdf.addPage([612, 792])
  drawPageChrome(page2, colors)
  const page2StartY = drawContinuationHeader(page2, fonts, colors)
  drawContinuationSidebar(page2, fonts, colors, page2StartY)
  const page2EndY = drawRoles(page2, resume.roles.slice(3), fonts, colors, page2StartY)
  const trainingEndY = drawTraining(page2, fonts, colors, page2EndY)
  drawClosingSummary(page2, fonts, colors, trainingEndY)

  fs.writeFileSync(outPath, await pdf.save())
  console.log(outPath)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
