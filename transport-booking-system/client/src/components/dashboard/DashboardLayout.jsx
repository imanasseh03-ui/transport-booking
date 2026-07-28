import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../../styles/dashboard.css";


function DashboardLayout({ children }) {

    return (

        <div className="dashboard-layout">

            <Sidebar />


            <main className="dashboard-main">

                <Topbar />


                <section className="dashboard-content">

                    {children}

                </section>


            </main>

        </div>

    );
}


export default DashboardLayout;