import React, { useEffect, useState } from 'react'
import SideMenu from '../components/SideMenu'
import GroupsComponent from '../components/GroupsComponent'
import { API } from '../utils/API'
import LoadingCube from '../loading-animation/LoadingCube'
import BulkMailModal from '../modals/BulkMailModal'

interface Group {
  id: number,
  groupName: string,
  bulkMailLists: listItem[]
}
interface listItem {
  id: number,
  listName: string,
  mailRecipients: recipient[]
}

interface recipient {
  id: number, 
  emailAddress: string
}

const Groups = () => {

    const [groupList, setGroupList] = useState<Group[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(true);
    const [showBulkMailModal, setShowBulkMailModal] = useState<boolean>(false);
    const [groupName, setGroupName] = useState<string>("");

    const closeBulkMailModal = (event: any) => {
      if(event.target.classList.contains("close")){
      setShowBulkMailModal(false);
      }
    }

    const openBulkMailModal = ({nameOfGroup} : any) => {
      setGroupName(nameOfGroup);
      setShowBulkMailModal(true);
    }

    const getGroups = async () => {
      const jwt = localStorage.getItem("jwtToken");
      const tok = JSON.parse(jwt || "");
      try {
        const response = await API.get(
          `/groups/groups-list`,
          {
            headers: {
              Authorization: `Bearer ${tok?.token}`
            }
          }
        );
        setGroupList(response.data);
        setIsLoading(false);
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getGroups();
  }, [])
  return (
    <div className='groups'>
        <SideMenu page={"groups"}/>
        <div className="content">
          <div className="header">
              <h1 className="title">Groups For Bulk Email Sending</h1>
          </div>


        <div className="groups-list">
          {groupList.map(group => {
            let number = 0;
            group?.bulkMailLists.forEach(list => {
              number += list?.mailRecipients.length;
            })
            return (
              <GroupsComponent groupName={group?.groupName} emailNumber={number} id={group?.id} openBulkModal={openBulkMailModal}/>
            )
          })}
        </div>

        </div>
        {showBulkMailModal && <BulkMailModal closeModal={closeBulkMailModal} groupToSendMail={groupName} />}

        {isLoading && 
            <div className='loading-info'><LoadingCube /> <h1>Loading ...</h1></div>}

    </div>
  )
}

export default Groups