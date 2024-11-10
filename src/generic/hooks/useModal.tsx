import type { ModalProps } from 'antd';

import { Modal } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

interface Props {
  onHide?: () => void;
  modalProps?: ModalProps;
}

const useModal = ({ onHide, modalProps: _modalProps }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalWidth, setModalWidth] = useState<number | string>('520px'); // Default modal width
  const [modalProps, setModalProps] = useState<ModalProps>(_modalProps ?? {});
  const [modalContentStyleTw, setModalContentStyleTw] = useState<string>('');

  useEffect(() => {
    if (_modalProps) {
      setModalProps(_modalProps);
    } else {
      setModalProps({});
    }
  }, []);

  const showModal = useCallback(
    (
      content: React.ReactNode,
      width: number | string = '1200px',
      modalProps?: ModalProps,
      modalContentStyleTw?: string,
    ) => {
      setModalContent(content);
      setModalWidth(width);
      setIsModalVisible(true);
      modalProps && setModalProps(prev => ({ ...modalProps }));
      modalContentStyleTw && setModalContentStyleTw(modalContentStyleTw);
    },
    [],
  );

  const hideModal = useCallback(() => {
    setIsModalVisible(false);
    setModalContent(null);
    onHide?.();
  }, []);

  const renderModal = (contnentStyle?: React.CSSProperties) => (
    <Modal
      visible={isModalVisible}
      onCancel={hideModal}
      // footer={null}
      width={modalWidth}
      // styles={{ content: { paddingTop: 50, margin: '0 auto', ...contnentStyle } }}
      className={`m-auto pb-0 ${modalContentStyleTw}`}
      {...(modalProps ?? {})}
    >
      {modalContent}
    </Modal>
  );

  return { showModal, hideModal, renderModal };
};

export default useModal;
