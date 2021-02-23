import React, { useContext, useState, FC } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Col, FlexboxGrid, List, Notification} from 'rsuite';

import {
  deletePosition,
  ElectionDetails,
} from '../utils/api/ElectionManagement';
import { User } from '../utils/api/User';
import { Credentials } from '../utils/Authentication';
import ConfirmModal from './ConfirmModal';

interface PLProps {
  election: ElectionDetails;
  updateElection: () => void;
}

const PositionList: FC<PLProps> = ({ election, updateElection }) => {
  const ctx = useContext(Credentials);
  const user = useContext(User);
  const history = useHistory();
  const [
    isDeletePositionModalOpen,
    setIsDeletePositionModalOpen,
  ] = useState<boolean>(false);
  function closeDeletePositionModal() {
    setIsDeletePositionModalOpen(false);
  }
  if (!user || !ctx) return null;

  const showDelete = user.user.id === election.manager.id;

  function deletePositionHandler(result: number) :void{
    if (result == 204){
      setIsDeletePositionModalOpen(false);
      updateElection();
      Notification['success']({
        title: 'Success',
        description: 'The position has been successfully deleted',
      });
    }else{
      setIsDeletePositionModalOpen(false);
      Notification['error']({
        title: 'Error',
        description: 'Failed to delete the position',
      });
    }
  }

  return (
    <div>
      {election.positions.length !== 0 ? (
        <List>
          {election.positions.map((position, index) => (
            <List.Item key={index}>
              <FlexboxGrid align="middle" justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} sm={12}>
                  <h5>{position.title}</h5>
                  <p>{position.description}</p>
                </FlexboxGrid.Item>
                {showDelete && (
                  <FlexboxGrid.Item
                    componentClass={Col}
                    colspan={12}
                    sm={6}
                    style={{ paddingRight: 20, textAlign: 'right' }}
                  >
                    <Button
                      appearance="primary"
                      color="red"
                      onClick={() => {
                        setIsDeletePositionModalOpen(true);
                      }}
                      block
                    >
                      Delete
                    </Button>
                    <ConfirmModal
                      modalTitle="Delete Position"
                      modalBody="Do you want to delete this Position?"
                      callBackFunc={() => deletePosition(position.id)}
                      isOpen={isDeletePositionModalOpen}
                      closeModal={() => closeDeletePositionModal()}
                      cleanUpFunc={(result: number) => deletePositionHandler(result)}
                    />
                  </FlexboxGrid.Item>
                )}
                <FlexboxGrid.Item
                  componentClass={Col}
                  colspan={12}
                  sm={6}
                  style={{ paddingRight: 20, textAlign: 'right' }}
                >
                  {/*Navigate to the position application form*/}
                  <Button
                    block
                    disabled={
                      !election.applications_open || !election.domain_match
                    }
                    onClick={() => {
                      history.push(`/apply/${position.id}`);
                    }}
                  >
                    Apply Now
                  </Button>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </List.Item>
          ))}
        </List>
      ) : (
        <FlexboxGrid>
          <p>No positions posted yet. Check back soon for updates.</p>
        </FlexboxGrid>
      )}
    </div>
  );
};

export default PositionList;
