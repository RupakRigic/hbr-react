import React, { Fragment, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import ClipLoader from 'react-spinners/ClipLoader';

const NotifyAdminList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeKey, setActiveKey] = useState("admin");

  return (
    <Fragment>
      <div className="page-titles">
        <ol className="breadcrumb">
          <li><h5 className="bc-title">Notify Admin</h5></li>
        </ol>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center pb-0">
                    <div className="d-flex text-nowrap justify-content-between align-items-center">
                      <h4 className="heading mb-0">Notify Admin List</h4>
                    </div>
                  </div>
                  <Tabs
                    activeKey={activeKey}
                    onSelect={(key) => setActiveKey(key)}
                    className="mb-3 custom-tabs mt-2"
                  >
                    <Tab eventKey="admin"
                      title={
                        <span style={{ fontWeight: activeKey === "admin" ? "bold" : "normal" }}>Admin</span>
                      }
                    >
                      <div
                        id="employee-tbl_wrapper"
                        className="dataTables_wrapper no-footer"
                        style={{ marginTop: "-14px" }}
                      >
                        {isLoading ? (
                          <div className="d-flex justify-content-center align-items-center mb-5">
                            <ClipLoader color="#4474fc" />
                          </div>
                        ) : (
                          <table
                            id="empoloyees-tblwrapper"
                            className="table ItemsCheckboxSec dataTable no-footer mb-0"
                          >
                            <thead>
                              <tr style={{ textAlign: "center" }}>
                                <th><strong>No.</strong></th>
                                <th>user Name</th>
                                <th>Email</th>
                              </tr>
                            </thead>
                            <tbody style={{ textAlign: "center" }}>

                            </tbody>
                          </table>
                        )}
                      </div>
                    </Tab>
                    <Tab eventKey="accountAdmin"
                      title={
                        <span style={{ fontWeight: activeKey === "accountAdmin" ? "bold" : "normal" }}>Account Admin</span>
                      }
                    >
                      <div
                        id="employee-tbl_wrapper"
                        className="dataTables_wrapper no-footer"
                        style={{ marginTop: "-14px" }}
                      >
                        {isLoading ? (
                          <div className="d-flex justify-content-center align-items-center mb-5">
                            <ClipLoader color="#4474fc" />
                          </div>
                        ) : (
                          <table
                            id="empoloyees-tblwrapper"
                            className="table ItemsCheckboxSec dataTable no-footer mb-0"
                          >
                            <thead>
                              <tr style={{ textAlign: "center" }}>
                                <th><strong>No.</strong></th>
                                <th>User Name</th>
                                <th>Email</th>
                              </tr>
                            </thead>
                            <tbody style={{ textAlign: "center" }}>

                            </tbody>
                          </table>
                        )}
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default NotifyAdminList;
