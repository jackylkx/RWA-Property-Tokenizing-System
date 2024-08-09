import React from "react"
import Web3 from "web3";
import Connect from "./Connect";
import { useEffect, useState } from "react";
import {Link} from "react-router-dom"
import logo from "../logo.jpg"
import banner from "../banner.jpg"

const Header = ({
    web3,
    account,
    shortAddress,
    setContract,
    setAccount,
    setProfileContract,
    setWeb3,
    fnConnectWallet
  }) => {

   

    return (
        <div className="header">
            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-light">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to="/">
                            <div className="d-flex align-items-center">
                                
                            <i className="fas fa-home" style={{color:'#ffffff'}}></i>
                                <span className="ms-2">
                                    
                           </span>
                            </div>
                        </Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">Home</Link>
                                </li>
                                {/* <li className="nav-item">
                                    <Link  className="nav-link" to="/blog">Blog</Link>
                                </li> */}
                                <li className="nav-item">
                                    <Link  className="nav-link" to="/listing">List Your Property</Link>
                                </li>
                                {
                                    account  ? (
                                        <li className="nav-item">
                                            <Link  className="nav-link" to="/mypropertiesListing">My Property</Link>
                                        </li>
                                    ) :("")
                                }
                                {
                                    account  ? (
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/FundReleaseList">Fund Release</Link>
                                        </li>
                                    ) :("")
                                }
                                {/* <li className="nav-item">
                                    <Link className="nav-link" to="#">Category <i className="fas fa-chevron-down"></i></Link>
                                    <ul className="sub-ul">
                                        <li><Link to="#">item</Link></li>
                                        <li><Link to="#">item</Link></li>
                                        <li><Link to="#">item</Link></li>
                                    </ul>
                                </li> */}
                                <li className="nav-item">
                                <Connect
                                    web3={web3}
                                    setWeb3={setWeb3}
                                    account={account}
                                    setAccount={setAccount}
                                    setContract={setContract}
                                    shortAddress={shortAddress}
                                    setProfileContract={setProfileContract}
                                    fnConnectWallet={fnConnectWallet}
                                />
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    )
}

export default Header;