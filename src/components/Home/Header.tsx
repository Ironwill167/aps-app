import React from 'react';

interface HeaderProps {
  onStatusSort: () => void;
  sortOrder: 'asc' | 'desc';
}

const Header: React.FC<HeaderProps> = React.memo(({ onStatusSort, sortOrder }) => (
  <div className="actionHeadingsContainer">
    <div className="FileNumberColumn actionHeading">File Number</div>
    <div
      className="StatusColumn actionHeading"
      onClick={onStatusSort}
      style={{ cursor: 'pointer' }}
    >
      Status {sortOrder === 'asc' ? '▲' : '▼'}
    </div>
    <div className="InsuredColumn actionHeading">Insured</div>
    <div className="PrincipalColumn actionHeading">Principal</div>
    <div className="PrincipalContactColumn actionHeading">Principal Contact</div>
    <div className="PrincipalRefColumn actionHeading">Principal Ref</div>
    <div className="LastUpdatedColumn actionHeading">Last Action</div>
    <div className="FileNoteColumn actionHeading">File Note</div>
    <div className="TotalFeeColumn actionHeading">Total Fee</div>
  </div>
));

export default Header;
