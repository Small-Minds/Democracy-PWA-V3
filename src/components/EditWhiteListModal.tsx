import React, { useState } from 'react';
import { useEffect } from 'react';
import { Button, ControlLabel, Form, FormControl, FormGroup, Input, Loader, Modal, Notification, Schema } from 'rsuite';
import { getManagedElectionDetails, ManagedElectionDetails, updateManagedElection } from '../utils/api/ElectionManagement';

interface EditWhiteListModalInput {
  closeModal: () => void;
  isOpen: boolean;
  electionId: string;
}

export default function EditWhiteListModal({
  closeModal,
  isOpen,
  electionId,
}: EditWhiteListModalInput) {
  let electionDetail: ManagedElectionDetails|undefined;
  let form: any = undefined;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});
  const [formData, setFormData] = useState<Record<string, any>>({
    whitelist: electionDetail?.whitelist
  });
  const model = Schema.Model({
      whitelist: Schema.Types.StringType()
  })

  useEffect(() => {
      getManagedElectionDetails(electionId)
      .then((res:ManagedElectionDetails)=>{
        electionDetail = res;  
        setIsLoading(false);})
  });
  
  function submitWhitelist(input: string): void{
    if(electionDetail){
        const newManagedElectionDetails: ManagedElectionDetails={
            ...electionDetail,
            whitelist: input
        }
        updateManagedElection(newManagedElectionDetails,electionId)
        .then((res:number)=>{
            if(res == 200){
                Notification['success']({
                    title: 'Success',
                    description: 'The election whitelist has been successfully updated',
                });
                closeModal();
            }else{
                Notification['error']({
                    title: 'Error',
                    description: 'Failed to submit the whitelist',
                });
            }
        })
    }
  }
  return (
    <Modal
      backdrop="static"
      show={isOpen}
      onHide={() => closeModal()}
      size="lg"
    >
      <Modal.Header>
          <h5>Edit Whitelist</h5>
      </Modal.Header>
      <Modal.Body>
        {isLoading?<Loader/>:
        <Form
        onChange={(newData) => setFormData(newData)}
        onCheck={(newErrors) => setFormErrors(newErrors)}
        formValue={formData}
        formError={formErrors}
        model={model}
        ref={(ref: any) => (form = ref)}
        fluid>
            <FormGroup>
            <ControlLabel>Whitelist: </ControlLabel>
            <FormControl name="whitelist" componentClass="textarea" rows={100} placeholder="whitelist" type="string"/>
            </FormGroup>
        </Form>}
        
      </Modal.Body>
      <Modal.Footer>
        <Button appearance="primary" disabled={isLoading} onClick={()=>submitWhitelist(formData.whitelist)}>Submit</Button>
        <Button appearance="default" onClick={() => closeModal()}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
