
import Gallery3D from "./components/Gallery3D";
import "./App.css";
import BrandLogo from "./components/BrandLogo";
import TypingTitle from "./components/TypingTitle";
import BackgroundRipple from "./components/BackgroundRipple";
import AmbientWaterBackground from "./components/AmbientWaterBackground";
// import SoftwareStar from "./components/SoftwareStar";

export default function App() {
  return (
    <main className="portfolio">
      <AmbientWaterBackground />

      <div className="page-content">
        <BackgroundRipple />
        <nav className="navbar">
          <BrandLogo />

          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#works">Works</a>
            <a href="#contact">Contact</a>
          </div>

          <span className="availability">
            AVAILABLE FOR PROJECTS
          </span>
        </nav>

        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">
              PERSONAL PORTFOLIO — 2026
            </span>

            <TypingTitle />

            <p>
              Capturing life is the expression of its beauty and complexity.
            </p>

            <a href="#works" className="explore-button">
              EXPLORE MY WORKS
              <span>↘</span>
            </a>
          </div>

          <div className="hero-bottom">
            <span>BASED IN INDONESIA</span>
            <span>FAHMI PUTRA</span>
            <span>SCROLL TO DISCOVER</span>
          </div>
        </section>

        <section id="works" className="works-section">
          <div className="works-heading">
            <span>SELECTED WORKS — 2025/26</span>
            <h2>Visual Archive</h2>
            <p>
              An immersive collection of creative works.
            </p>
          </div>

          
          <Gallery3D />

          <div className="works-footer">
            <span>END OF COLLECTION</span>
            <span>SCROLL TO EXPLORE</span>
          </div>
        </section>

        <footer id="contact">
          <span>LET'S CREATE SOMETHING.</span>

          <h2>
            Have a project
            <br />
            in mind?
          </h2>

          <a href="mailto:hello@example.com">
            GET IN TOUCH ↗
          </a>

          <div className="footer-bottom">
            <span>© 2026 FP. PORTFOLIO</span>
            <span>IT'LL NEVER HAPPEN UNLESS YOU TRY.</span>
          </div>
        </footer>
      </div>

    </main>
  );
}
