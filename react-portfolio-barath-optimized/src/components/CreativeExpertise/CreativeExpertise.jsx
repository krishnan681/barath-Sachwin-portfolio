import "./CreativeExpertise.css";
import { Sparkles, Type, Palette, Share2, Camera, Clapperboard } from "lucide-react";

export default function CreativeExpertise() {
  return (
    <section className="expertise-section" id="creative-expertise">
      <div className="container">
        <div className="title" data-aos="fade-up">
          <div className="bg-text">Creative</div>
          <h1 className="main-title">Expertise</h1>
        </div>

        <div className="CE-heading text-center" data-aos="fade-up" data-aos-delay="100">
          <p>
            <span>The ability to conceptualize, design, and produce visually engaging content</span>
            <span>that communicates a brand's message and resonates with target audiences.</span>
          </p>
        </div>

        <div className="row g-4 d-flex align-items-stretch">
          {/* Left Card */}
          <div className="col-lg-6 d-flex" data-aos="fade-up" data-aos-delay="150">
            <div className="expertise-specular-wrap">
              <div className="expertise-card">
                <div className="card-top">
                  <span className="line"></span>
                  <span className="category">DESIGN &amp; VISUAL</span>
                  <span className="number">01</span>
                </div>

                <h2>
                  Design that
                  <br />
                  communicates with clarity.
                </h2>

                <div className="divider"></div>

                <div className="service-item">
                  <div className="count">01</div>

                  <div className="icon">
                    <Sparkles size={22} />
                  </div>

                  <div className="content">
                    <h4>Motion &amp; Visual Design</h4>
                    <p>Motion graphics & visual storytelling for brand engagement.</p>
                  </div>
                </div>

                <div className="service-item">
                  <div className="count">02</div>

                  <div className="icon">
                    <Type size={22} />
                  </div>

                  <div className="content">
                    <h4>Typography</h4>
                    <p>
                      Typography & letterform design for brand identity.
                    </p>
                  </div>
                </div>

                <div className="service-item">
                  <div className="count">03</div>

                  <div className="icon">
                    <Palette size={22} />
                  </div>

                  <div className="content">
                    <h4>Color Theory</h4>
                    <p>
                      Color palette & composition for brand consistency.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card */}
          <div className="col-lg-6 d-flex" data-aos="fade-up" data-aos-delay="250">
            <div className="expertise-specular-wrap">
              <div className="expertise-card">
                <div className="card-top">
                  <span className="line"></span>
                  <span className="category">CONTENT &amp; MEDIA</span>
                  <span className="number">02</span>
                </div>

                <h2>
                  Content that
                  <br />
                  leaves an impression.
                </h2>

                <div className="divider"></div>

                <div className="service-item">
                  <div className="count">01</div>

                  <div className="icon">
                    <Share2 size={22} />
                  </div>

                  <div className="content">
                    <h4>Social Media Content</h4>
                    <p>
                      Social media campaigns & content creation that boost audience engagement.
                    </p>
                  </div>
                </div>

                <div className="service-item">
                  <div className="count">02</div>

                  <div className="icon">
                    <Camera size={22} />
                  </div>

                  <div className="content">
                    <h4>Product Photography</h4>
                    <p>
                      Product photography & visual merchandising for premium brand presentation.
                    </p>
                  </div>
                </div>

                <div className="service-item">
                  <div className="count">03</div>

                  <div className="icon">
                    <Clapperboard size={22} />
                  </div>

                  <div className="content">
                    <h4>Cinematography</h4>
                    <p>
                      Cinematography & visual storytelling for high-quality video production.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}