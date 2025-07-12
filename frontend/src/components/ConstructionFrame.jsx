import { useState } from 'react';
import { HardHat, AlertTriangle, X } from 'lucide-react';

const ConstructionFrame = ({ children, maintenanceEnabled, comingSoonEnabled }) => {
  const [showWarning, setShowWarning] = useState(true);

  if (!maintenanceEnabled && !comingSoonEnabled) {
    return children;
  }

  return (
    <div className="construction-frame">
      {/* Admin-Warnung oben */}
      {showWarning && (
        <div className="admin-warning">
          <div className="admin-warning-content">
            <div className="admin-warning-icon">
              <HardHat size={20} />
            </div>
            <div className="admin-warning-text">
              <strong>Admin-Modus aktiv</strong>
              <span>
                {maintenanceEnabled && comingSoonEnabled 
                  ? 'Wartungsarbeiten und Coming-Soon sind aktiviert. Sie sehen die Website im Admin-Modus.'
                  : maintenanceEnabled 
                    ? 'Wartungsarbeiten sind aktiviert. Sie sehen die Website im Admin-Modus.'
                    : 'Coming-Soon ist aktiviert. Sie sehen die Website im Admin-Modus.'
                }
              </span>
            </div>
            <button 
              className="admin-warning-close"
              onClick={() => setShowWarning(false)}
              aria-label="Warnung schließen"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Bauarbeiter-Rahmen */}
      <div className="construction-border construction-border-top"></div>
      <div className="construction-border construction-border-right"></div>
      <div className="construction-border construction-border-bottom"></div>
      <div className="construction-border construction-border-left"></div>

      {/* Bauarbeiter-Icons in den Ecken */}
      <div className="construction-corner construction-corner-tl">
        <HardHat size={16} />
      </div>
      <div className="construction-corner construction-corner-tr">
        <HardHat size={16} />
      </div>
      <div className="construction-corner construction-corner-bl">
        <HardHat size={16} />
      </div>
      <div className="construction-corner construction-corner-br">
        <HardHat size={16} />
      </div>

      {/* Hauptinhalt */}
      <div className="construction-content">
        {children}
      </div>
    </div>
  );
};

export default ConstructionFrame; 