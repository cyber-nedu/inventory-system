import Home from "@/app/components/home/home"
import About from "@/app/components/about/about"
import Howitworks from "@/app/components/how-it-works/how-it-works"
import Contacts from "@/app/components/contacts/contacts"
import Navbar from "@/app/components/navbar"

const KyypProject: React.FC = () => {
  return (
    <main>
      <Navbar />
      <Home />
      <About />
      <Howitworks />
      <Contacts />
    </main>
  )
}

export default KyypProject;