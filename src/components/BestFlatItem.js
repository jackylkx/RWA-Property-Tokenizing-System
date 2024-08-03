import {Link} from "react-router-dom"
const BestFlatItem = ({flatState, image, title, desc, landsize}) => {
    return (
        <div className="best-estate">
            <div className="best-estate-item">
                <div className="best-estate-img-area">
                    <img className="best-estate-img" src={"/img/"+ image} alt="flat" />
                    <div className={`best-estate-state ${flatState ==="For Rent" ? "bg-green" : "bg-red" }`}>{flatState}</div>
                </div>
                <div className="best-estate-content">
                    <h4><Link to="/">{title}</Link></h4>
                    <span><Link to="/">{desc}</Link></span>
                </div>
                <div className="best-estate-features">
                    <div className="d-flex">
                        <div className="best-estate-feature">
                            <i className="fas fa-check-circle"></i>
                            <span>Land Size: {landsize}</span>
                        </div>
                    </div>
                    <h5 className="best-estate-price"><i className='fab fa-ethereum' style={{ fontSize: '24px' }}></i>20</h5>
                </div>
            </div>
        </div>
    )
}

export default BestFlatItem