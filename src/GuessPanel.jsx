import ImageDropdown from "./ImageDropdown"

export default function GuessPanel({ active}) {
    return (
        <div className={"card" + (active == "true" ? "" : " deactivated")}>
            {active == "true" &&
                <>
                <div className="dataBox">
                    <ImageDropdown/>
                </div>
                <div className="dataBox">
                    <p>Temperature:</p>
                    <div className="numBox" id="high">
                        <label>H: </label>
                        <input type="number"/>
                        <label>°F</label>
                    </div>
                    <div className="numBox" id="low">
                        <label>L: </label>
                        <input type="number"/>
                        <label>°F</label>
                    </div>
                </div>
                <div className="dataBox">
                    <p>Humidity:</p>
                    <div className="numBox" id="humid">
                        <input type="number"/>
                        <label>%</label>
                    </div>
                    <p>Precipitation:</p>
                    <div className="numBox" id="precip">
                        <input type="number"/>
                        <label>mm</label>
                    </div>
                </div>
            </>
            }
        </div>
    )
}