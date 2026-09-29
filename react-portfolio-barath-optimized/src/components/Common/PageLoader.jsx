import Strands from '../Strands/Strands';
import './PageLoader.css';

export default function PageLoader({ text = 'Loading Showcase...' }) {
  return (
    <div className="page-loader-wrapper" role="status" aria-label="Loading page">
      <div className="page-loader-strands-bg">
        <Strands
          colors={['#F97316', '#7C3AED', '#06B6D4']}
          count={3}
          speed={0.5}
          amplitude={1}
          waviness={1}
          thickness={0.7}
          glow={2.6}
          taper={3}
          spread={1}
          intensity={0.6}
          saturation={2}
          opacity={1}
          scale={1.5}
          glass={false}
          refraction={1}
          dispersion={1}
          glassSize={1}
          hueShift={0}
        />
      </div>

      <div className="page-loader-content">
        <div className="page-loader-pulse-badge">
          <span className="page-loader-dot" />
          <span className="page-loader-brand">BARATH SACHWIN</span>
        </div>
        <h2 className="page-loader-title">{text}</h2>
      </div>
    </div>
  );
}
