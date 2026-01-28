import { IonSpinner } from '@ionic/react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  isOpen : boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isOpen }) => {
  if (!isOpen) return null;

    return (
        <div className="loading-overlay">
            <IonSpinner name ="circular" color ="primary" className="loading-spinner"/>
        </div>
    );
}

export default LoadingSpinner;