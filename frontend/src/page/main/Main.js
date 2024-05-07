import { useSelector } from 'react-redux';
import Broad from "../../components/broad/Broad";
import Broadlist from "../../components/broadlist/Broadlist";
import Messager from "../../components/messager/Messager";
import User from "../../components/user/user";
import Userlist from "../../components/userlist/Userlist";

const Main = () => {
    const broadStore = useSelector((state) => state.broad.broad);

    return (
        <div className="Main center">
            <User />
            <Userlist />
            <Broadlist />
            <Broad pid={broadStore.id} data={broadStore.data} />
            <Messager />
        </div>
    )
};

export default Main;