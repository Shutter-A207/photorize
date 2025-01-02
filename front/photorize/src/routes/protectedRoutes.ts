import Home from "../pages/Home/Home";
import Home2 from "../pages/Home2";
import Alarm from "../pages/Alarm/Alarm";
import Album from "../pages/Album/Album";
import Album2 from "../pages/Album2/Album2";
import Pose from "../pages/Pose/Pose";
import Spot from "../pages/Spot/Spot";
import AlbumDetail from "../pages/AlbumDetail/AlbumDetail";
import Memory from "../pages/Memory/Memory";
import Record from "../pages/Record/Record";
import SpotDetail from "../pages/SpotDetail/SpotDetail";
import AlbumEdit from "../pages/AlbumEdit/AlbumEdit";
import ModifyMemory from "../pages/ModifyMemory/ModifyMemory";


export const protectedRoutes = [
    {
      path: '/home',
      Component: Home
    },
    {
      path: '/home2', 
      Component: Home2
    },
    {
      path: '/notifications',
      Component: Alarm
    },
    {
        path: '/album',
        Component: Album
    },
    {
        path: '/album2',
        Component: Album2
    },
    {
        path: '/album/:id',
        Component: AlbumDetail
    },
    {
        path: '/album/edit',
        Component: AlbumEdit
    },
    {
        path: '/memory/:id',
        Component: Memory
    },
    {
        path: '/modify-memory/:id',
        Component: ModifyMemory
    },
    {
        path: '/record',
        Component: Record
    },
    {
        path: '/pose',
        Component: Pose
    },
    {
        path: 'spot',
        Component: Spot
    },
    {
        path: '/spot/:id',
        Component: SpotDetail
    },
  ];
  