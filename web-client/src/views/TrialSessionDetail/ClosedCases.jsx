import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const ClosedCases = connect(
  {
    closedCases: state.formattedTrialSessionDetails.closedCases,
  },
  ({ closedCases }) => {
    return (
      <React.Fragment>
        <div className="text-semibold push-right margin-bottom-2 margin-top-neg-205">
          Count: {closedCases.length}
        </div>
        <table
          aria-describedby="closed-cases-tab"
          className="usa-table ustc-table trial-sessions subsection"
          id="closed-cases"
        >
          <thead>
            <tr>
              <th>Docket</th>
              <th>Case name</th>
              <th>Disposition</th>
              <th>Disposition date</th>
            </tr>
          </thead>
          {closedCases.map((item, idx) => (
            <tbody key={idx}>
              <tr className="eligible-cases-row">
                <td>
                  <CaseLink formattedCase={item} />
                </td>
                <td>{item.caseCaptionNames}</td>
                <td>{item.disposition}</td>
                <td>{item.removedFromTrialDate}</td>
              </tr>
            </tbody>
          ))}
        </table>
        {closedCases.length === 0 && <p>There are no closed cases.</p>}
      </React.Fragment>
    );
  },
);
