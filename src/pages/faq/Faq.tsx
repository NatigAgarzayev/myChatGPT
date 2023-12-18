import { useNavigate } from "react-router-dom"


export default function Faq() {

    const nav = useNavigate()
    return (
        <div>
            It's a FAQ page.
            <div onClick={() => nav("/")}>Go home</div>
        </div>
    )
}
