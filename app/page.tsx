import Home from "@/app/components/home/home"
import About from "@/app/components/about/about"
import Howitworks from "@/app/components/how-it-works/how-it-works"
import Contacts from "@/app/components/contacts/contacts"
import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

const KyypProject: React.FC = () => {
  return (
    <main>
      <Navbar />
      <Home />
      <About />
      <Howitworks />
      <Contacts />
      <Footer />
    </main>
  )
}

export default KyypProject;