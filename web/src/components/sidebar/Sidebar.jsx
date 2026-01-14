import './Sidebar.css';

const Sidebar = ({ motoristas, onSelectMotorista, motoristaSelecionado }) => {
  return (
    <div className="sidebar">
      <h2>Motoristas</h2>
      <div className="motoristas-lista">
        {motoristas.length === 0 ? (
          <p className="sem-motoristas">Nenhum motorista encontrado</p>
        ) : (
          motoristas.map((motorista) => (
            <div
              key={motorista.id}
              className={`motorista-item ${motoristaSelecionado?.id === motorista.id ? 'ativo' : ''}`}
              onClick={() => onSelectMotorista(motorista)}
            >
              <div className="motorista-nome">{motorista.nome}</div>
              <div className="motorista-tipo">{motorista.tipo}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
