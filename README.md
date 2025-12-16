# Strength for Life

A fitness tracking app focused on bodyweight exercises for healthspan and longevity. Built with Next.js, React, and Tailwind CSS.

## Features

- **Exercise Tracking**: Log push-ups, squats, lunges, dips, and crunches
- **Daily Goals**: Set and track daily rep goals for each exercise
- **DEXA Body Composition**: Track ALMI (Appendicular Lean Mass Index) with age-adjusted reference ranges
- **Learning Center**: Educational content about each exercise and its importance for longevity
- **AI Coach**: Voice-enabled AI assistant for logging exercises and getting form tips
- **Achievements**: Unlock achievements as you progress
- **Beautiful UI**: Oura Ring-inspired design with dark theme

## Tech Stack

- **Framework**: Next.js 14
- **UI**: React 18 + Tailwind CSS
- **Charts**: Recharts
- **AI**: Anthropic Claude API (for Learning Center and DEXA parsing)
- **Storage**: localStorage (client-side)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/strength-for-life.git
cd strength-for-life
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

The easiest way to deploy this app is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Vercel will automatically detect Next.js and configure the build settings
4. Click "Deploy"

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/strength-for-life)

## ALMI Reference Ranges

The app uses evidence-based ALMI reference ranges from NHANES and EWGSOP research:

### Men
| Age | Typical | Strong | Low (Sarcopenic) |
|-----|---------|--------|------------------|
| 20-39 | 8.0-10.0 | >10.0 | <7.0 |
| 40-59 | 7.5-9.5 | >9.5 | <7.0 |
| 60+ | 7.0-9.0 | >9.0 | <7.0 |

### Women
| Age | Typical | Strong | Low (Sarcopenic) |
|-----|---------|--------|------------------|
| 20-39 | 5.5-7.5 | >7.5 | <5.5 |
| 40-59 | 5.5-7.0 | >7.0 | <5.5 |
| 60+ | 5.0-6.8 | >6.8 | <5.5 |

## Research References

- Yang J, et al. "Association Between Push-up Exercise Capacity and Future Cardiovascular Events Among Active Adult Men." JAMA Network Open. 2019.
- Cruz-Jentoft AJ, et al. "Sarcopenia: revised European consensus on definition and diagnosis." Age Ageing. 2019.

## License

MIT License - feel free to use this for your own projects!
