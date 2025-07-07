import React from 'react';

const Header: React.FC = React.memo(() => (
  <div className="actionHeadingsContainer">
    <div className="FileNumberColumn actionHeading">File</div>
    <div className="vertSeperator"></div>
    <div className="StatusColumn actionHeading">Status</div>
    <div className="vertSeperator"></div>
    <div className="InsuredColumn actionHeading">Insured</div>
    <div className="vertSeperator"></div>
    <div className="PrincipalColumn actionHeading">Principal</div>
    <div className="vertSeperator"></div>
    <div className="PrincipalContactColumn actionHeading">Principal Contact</div>
    <div className="vertSeperator"></div>
    <div className="PrincipalRefColumn actionHeading">Principal Ref</div>
    <div className="vertSeperator"></div>
    <div className="LastUpdatedColumn actionHeading">Last Action</div>
    <div className="vertSeperator"></div>
    <div className="FileNoteColumn actionHeading">File Note</div>
    <div className="vertSeperator"></div>
    <div className="TotalFeeColumn actionHeading">Total Fee</div>
  </div>
));

export default Header;
