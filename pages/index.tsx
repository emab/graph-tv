import {useEffect, useState} from "react";
import * as d3 from "d3";
import style from "@/styles/Home.module.css";
import { Search } from "@/components/Search";
import { useQuery } from 'react-query';


const getSeasonData = async (id: number | undefined) => {
  if (typeof id !== "number") return Promise.resolve(null);
  const response = await fetch(`/api/show/${id}`);
  return await response.json()
}

export default function Home() {
    const [selectedId, setSelectedId] = useState<number>();

    useEffect(() => {
        d3.select('body').append('div').attr('class', 'tooltip');
    }, []);

    const {data} = useQuery(["getSeasonData", selectedId], () => getSeasonData(selectedId));



    return (
        <>
            <div className={style.searchBar}>
                <h1>Graph TV</h1>
              <p>Selected ID: {selectedId}</p>
                <Search setSelectedId={setSelectedId}/>
            </div>
          <div>{JSON.stringify(data)}</div>
            {/*{loading ? (*/}
            {/*    <div className={style.loader}>*/}
            {/*        <Loader active inline="centered">*/}
            {/*            Loading IMDB Data...*/}
            {/*        </Loader>*/}
            {/*    </div>*/}
            {/*) : (null*/}
            {/*    // <Transition visible={!loading} animation="scale" duration={500}>*/}
            {/*    //     <GraphDisplay data={[]}/>*/}
            {/*    // </Transition>*/}
            {/*)}*/}
        </>
    );
}
