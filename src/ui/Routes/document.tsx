export default function DocumentPage(){   
    return(
        <div>
            <h1>Hello world after auth</h1>
            <code>
                {window.localStorage.getItem("user")}
            </code>
        </div>
    );
}