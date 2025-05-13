import {useNavigate,Outlet} from "react-router-dom";
import {useEffect} from "react";


function ProtectedLayout({userAuthenticated}) {
    const navigate = useNavigate();


    useEffect(() => {
        if (!userAuthenticated) {
            navigate('/login');
        }
    }, [userAuthenticated, navigate]);

    if (!userAuthenticated) {
        return null; // Prevents rendering anything if not authenticated
    }

    return <Outlet />;

}
export default ProtectedLayout;