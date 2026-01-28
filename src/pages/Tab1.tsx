import { IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar, useIonViewDidEnter, IonModal, IonButton, IonInput, IonItem, IonLabel, IonTextarea, IonFooter, IonAlert, IonToast } from '@ionic/react';
import { useState, useRef } from 'react';

import './Tab1.css';
import RepoItem from '../components/RepoItem';
import { RepositoryItem } from '../interfaces/RepositoryItem';
import { fetchRepositories, deleteRepository, updateRepository } from '../services/GithubService';
import LoadingSpinner from '../components/LoadingSpinner';

const Tab1: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<any>(null);
  
  // Estados principales: lista, edición y mensajes (alert/toast)
  const [repos, setRepos] = useState<RepositoryItem[]>([]);
  const [editingRepo, setEditingRepo] = useState<RepositoryItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Estado para confirmación de borrado
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [repoToDelete, setRepoToDelete] = useState<RepositoryItem | null>(null);


  // Toast para notificaciones de éxito/error
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger' | 'warning' | 'primary'>('success');

  // Carga repositorios desde el servicio y actualiza el estado
  const loadRepos = async () => {
    setLoading(true);
    try {
      const reposData = await fetchRepositories();
      setRepos(reposData);
    } finally {
      setLoading(false);
    }
  };

  // Cargar repos al entrar en la vista (lifecycle de Ionic)
  useIonViewDidEnter(() => {
    console.log ("IonViewDidEnter: Cargando repositorios...");  
    loadRepos();
  });

  // Inicia el proceso de borrado: guarda el repo y muestra la alerta de confirmación
  const handleDelete = (repo: RepositoryItem) => {
    if (!repo.owner) {
      alert('No se pudo eliminar: propietario desconocido');
      return;
    }

    setRepoToDelete(repo);
    setShowDeleteAlert(true);
  }; 

  // Confirma la eliminación: llama al servicio y limpia el estado local; muestra toast con resultado
  const confirmDelete = async () => {
    if (!repoToDelete || !repoToDelete.owner) return;

    try {
      setLoading(true);
      await deleteRepository(repoToDelete.owner, repoToDelete.name);
      setRepos(prev => prev.filter(r => (r.full_name || `${r.owner}/${r.name}`) !== (repoToDelete.full_name || `${repoToDelete.owner}/${repoToDelete.name}`)));
      setToastMessage(`Repositorio "${repoToDelete.name}" eliminado`);
      setToastColor('success');
      setShowToast(true);
    } catch (error) {
      console.error(error);
      setToastMessage('Error al eliminar el repositorio. Revisa la consola para más detalles.');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
      setRepoToDelete(null);
      setShowDeleteAlert(false);
    }
  }; 

  // Abre el modal de edición y precarga los campos del repositorio
  const openEdit = (repo: RepositoryItem) => {
    setEditingRepo(repo);
    setEditName(repo.name);
    setEditDescription(repo.description || '');
    modalRef.current?.present();
  }; 

  const closeEdit = () => {
    modalRef.current?.dismiss();
    setEditingRepo(null);
    setEditName('');
    setEditDescription('');
  };

  // Guarda cambios: hace PATCH y actualiza la lista local con la respuesta
  const saveEdit = async () => {
    if (!editingRepo) return;
    if (!editingRepo.owner) {
      alert('No se pudo editar: propietario desconocido');
      return;
    }

    try {
      setLoading(true);
      const updated = await updateRepository(editingRepo.owner, editingRepo.name, { name: editName, description: editDescription || null });
      setRepos(prev => prev.map(r => ((r.full_name || `${r.owner}/${r.name}`) === (editingRepo.full_name || `${editingRepo.owner}/${editingRepo.name}`)) ? updated : r));
      closeEdit();
      setToastMessage('Repositorio actualizado correctamente');
      setToastColor('success');
      setShowToast(true);
    } catch (error) {
      console.error(error);
      setToastMessage('Error al editar el repositorio. Revisa la consola para más detalles.');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  }; 

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Repositorios</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {repos.map((repo) => (
            <RepoItem 
              key={repo.full_name || repo.name}
              repo={repo}
              onDelete={handleDelete}
              onEdit={openEdit}
              disabled={loading}
            />
          ))}
        </IonList>

        {/* Modal de edición: permite modificar nombre y descripción sin salir de la app */}
        <IonModal ref={modalRef} onDidDismiss={closeEdit}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Editar repositorio</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonItem>
              <IonLabel position="stacked">Nombre</IonLabel>
              <IonInput value={editName} onIonChange={(e: CustomEvent) => setEditName((e.detail?.value) as string)} placeholder="Ingrese el nombre" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Descripción</IonLabel>
              <IonTextarea value={editDescription} onIonChange={(e: CustomEvent) => setEditDescription((e.detail?.value) as string)} placeholder="Ingrese la descripción" />
            </IonItem>
          </IonContent>
          <IonFooter>
            <div style={{ display: 'flex', gap: 8, padding: 12 }}>
              <IonButton color="medium" onClick={closeEdit} disabled={loading}>Cancelar</IonButton>
              <IonButton color="primary" onClick={saveEdit} disabled={loading}>Guardar</IonButton>
            </div>
          </IonFooter>
        </IonModal>

        {/* Alert: confirmación de eliminación (más consistente que window.confirm) */}
        <IonAlert
          isOpen={showDeleteAlert}
          header="Confirmar eliminación"
          message={`¿Está seguro que desea eliminar "${repoToDelete?.name}"? Esta acción no se puede deshacer.`}
          buttons={[
            { text: 'Cancelar', role: 'cancel', handler: () => setShowDeleteAlert(false) },
            { text: 'Eliminar', role: 'confirm', handler: confirmDelete }
          ]}
        />

        {/* Toast: notificaciones breves de éxito/fracaso */}
        <IonToast
          isOpen={showToast}
          message={toastMessage}
          color={toastColor}
          duration={3000}
          onDidDismiss={() => setShowToast(false)}
        />
        <LoadingSpinner isOpen={loading} />


      </IonContent>
    </IonPage>
  );
};

export default Tab1;