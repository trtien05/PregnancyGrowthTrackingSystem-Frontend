import AchievementsSection from '../../components/AchievementSection'
import HeroSection from '../../components/HeroSection'
import TeamSection from '../../components/TeamSection'
import TestimonialsSection from '../../components/TestimonialsSection'
import useDocumentTitle from '../../hooks/useDocumentTitle'

function Home() {
  useDocumentTitle('PregnaJoy | Home')
  return (
    <>
      <HeroSection />
      <TeamSection />
      <AchievementsSection />
      <TestimonialsSection />
    </>
  )
}

export default Home
