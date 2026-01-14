import { IonItem, IonLabel, IonThumbnail, IonItemSliding, IonItemOptions, IonItemOption, IonIcon } from '@ionic/react';
import { pencilOutline, trashOutline } from 'ionicons/icons';
import './RepoItem.css';
import { RepositoryItem } from '../interfaces/RepositoryItem';

// Componente que muestra un repositorio y expone acciones (editar/eliminar)
const RepoItem: React.FC<{repo: RepositoryItem; onDelete: (repo: RepositoryItem) => void; onEdit: (repo: RepositoryItem) => void}> = ({ repo, onDelete, onEdit }) => {


  return (
    <IonItemSliding>
      <IonItem>
        <IonThumbnail slot="start">
          {/* Miniatura: uso del logo de Ionic para todos los items */}
          <img src={'/assets/ionic-logo.svg'} alt={repo.name} className="repo-thumbnail-img" />
        </IonThumbnail> 
        <IonLabel>
          <h2>{repo.name}</h2>
          <p>{repo.description}</p>
          <p>Propietario: {repo.owner}</p>
          <p>Lenguaje: {repo.language}</p>
        </IonLabel>
      </IonItem>

      <IonItemOptions side="end">
        {/* Editar: abre modal en la página padre para editar el repo */}
        <IonItemOption color="primary" onClick={() => onEdit(repo)} aria-label="Editar" title="Editar">
          <IonIcon icon={pencilOutline} className="repo-action-icon" />
        </IonItemOption>
        {/* Eliminar: solicita confirmación en la página padre (IonAlert) */}
        <IonItemOption color="danger" onClick={() => onDelete(repo)} aria-label="Eliminar" title="Eliminar">
          <IonIcon icon={trashOutline} className="repo-action-icon" />
        </IonItemOption>
      </IonItemOptions>  
    </IonItemSliding>
  );
};

export default RepoItem;