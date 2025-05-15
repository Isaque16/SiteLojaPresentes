enum EStatus {
  'PENDENTE' = 'Pendente',
  'PREPARANDO' = 'Preparando',
  'A_CAMINHO' = 'A caminho',
  'ENTREGUE' = 'Entregue'
}

function nextStatus(currentStatus: EStatus): EStatus {
  switch (currentStatus) {
    case EStatus.PENDENTE:
      return EStatus.PREPARANDO;
    case EStatus.PREPARANDO:
      return EStatus.A_CAMINHO;
    case EStatus.A_CAMINHO:
      return EStatus.ENTREGUE;
    case EStatus.ENTREGUE:
      return EStatus.ENTREGUE;
    default:
      throw new Error(`${currentStatus} não é um status válido`);
  }
}

export default EStatus;
export { nextStatus };
