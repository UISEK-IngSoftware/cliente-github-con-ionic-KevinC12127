import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import './Tab3.css';
import { use, useState } from 'react';
import { getUserInfo } from '../services/GithubService';
import { UserInfo } from '../interfaces/UserInfo';


const Tab3: React.FC = () => {

  const [UserInfo, setUserInfo] = useState<UserInfo | null>(null);

  const loadUserInfo = async () => {
    const info = await getUserInfo();
    setUserInfo(info);
  };

  useIonViewDidEnter(() => {
    loadUserInfo();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil de usuario</IonTitle> 
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 3</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonCard>
      <img alt = {UserInfo?.name}
      src = {UserInfo?.avatar_url} />
      <IonCardHeader>
        <IonCardTitle>{UserInfo?.name}</IonCardTitle>
        <IonCardSubtitle>{UserInfo?.login}</IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>{UserInfo?.bio}</IonCardContent>
    </IonCard>
  ;
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
