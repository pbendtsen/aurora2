'use client'
import Image from "next/image";
import { useEffect, useLayoutEffect, useState } from "react";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

async function fetchData(setNextOpening: any, setOpeningTime: any, setSoedt: any, setSoedtExtra: any, setSoedtAdditional: any) {
  const dato = doc(db, "open", "date");
  const datoSnap = await getDoc(dato);
  const time = doc(db, "open", "time");
  const timeSnap = await getDoc(time);
  const dessert = doc(db, "menu", "dessert");
  const dessertSnap = await getDoc(dessert);

  if (datoSnap.exists()) {
    setNextOpening(datoSnap.get('next_date'))
  }
  if (timeSnap.exists()) {
    setOpeningTime(timeSnap.get('open_time'))
  }
  if (dessertSnap.exists()) {
    setSoedt(dessertSnap.get('soedt'))
    setSoedtExtra(dessertSnap.get('soedt_extra'))
    setSoedtAdditional(dessertSnap.get('additional'))
  }
}

export default function Home() {

  const keyValuePairs: any = {
    plain: 13,
    plainVHO: 35,
    plainGK: 35,
    sesam: 13,
    sesamVHO: 35,
    sesamGK: 35,
    mixed: 13,
    mixedVHO: 35,
    mixedGK: 35,
    yoghurt: 65,
    soedt: 42,
    soedtUC: 36,
    soedtAdditional: 25
  };

  const [newOrder, setNewOrder] = useState<any>({
    name: '', 
    phone: '',
    pickup: '', 
    plain: 0,
    plainVHO: 0,
    plainGK: 0,
    sesam: 0,
    sesamVHO: 0,
    sesamGK: 0,
    mixed: 0,
    mixedVHO: 0,
    mixedGK: 0,
    yoghurt: 0,
    soedt: 0,
    soedtUC: 0,
    soedtAdditional: 0,
    comment: ''
  })
  const [nextOpening, setNextOpening] = useState('')
  const [openingTime, setOpeningTime] = useState('')
  const [soedt, setSoedt] = useState('')
  const [soedtExtra, setSoedtExtra] = useState('')
  const [soedtAdditional, setSoedtAdditional] = useState('')
  const [loading, setLoading] = useState(true);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [showLove, setShowLove] = useState(false);
  const [showError, setShowError] = useState(false);
  const [sum, setSum] = useState(0);
  const [imageUrl, setImageUrl] = useState('/facade3.png');


  useEffect(() => {
    fetchData(setNextOpening, setOpeningTime, setSoedt, setSoedtExtra, setSoedtAdditional).then(() => setLoading(false));
  }, []);
  
  useEffect(() => {
    getSum();
  }, [newOrder]);

  useLayoutEffect(() => {
    const isMobile = window.innerWidth <= 640;
    setImageUrl(isMobile ? '/facade.png' : '/facade3.png');
  }, []);

  const addItem = async (e: any) => {
    e.preventDefault()
    if (newOrder.name !== '' && newOrder.phone !== '') {
      
      setShowError(false)
      setLoadingAdd(true);

      const now = new Date();

      await addDoc(collection(db, 'orders'), {
        name: newOrder.name,
        phone: newOrder.phone,
        pickup: newOrder.pickup,
        plain: newOrder.plain,
        plainVHO: newOrder.plainVHO,
        plainGK: newOrder.plainGK,
        sesam: newOrder.sesam,
        sesamVHO: newOrder.sesamVHO,
        sesamGK: newOrder.sesamGK,
        mixed: newOrder.mixed,
        mixedVHO: newOrder.mixedVHO,
        mixedGK: newOrder.mixedGK,
        yoghurt: newOrder.yoghurt,
        soedt: newOrder.soedt,
        soedtUC: newOrder.soedtUC,
        soedtAdditional: newOrder.soedtAdditional,
        comment: newOrder.comment,
        sum: sum,
        time: now.toLocaleDateString()
      }).then(() => {
        setLoadingAdd(false);
        setShowLove(true);
      })
      setNewOrder({name: '', phone: '', pickup: '', plain: 0, plainVHO: 0, plainGK: 0, sesam: 0, sesamVHO: 0, sesamGK: 0, mixed: 0, mixedVHO: 0, mixedGK: 0, yoghurt: 0, soedt: 0, soedtUC: 0, soedtAdditional: 0, comment: ''});
    }
    else {
      setShowError(true)
    }
  }

  const getSum = () => {
    let tmpSum = 0;
    for (const prop in newOrder) {
      if (newOrder.hasOwnProperty(prop) && prop !== 'name' && prop !== 'phone' && prop !== 'pickup' && prop !== 'comment') {
        tmpSum += (newOrder[prop] as number) * (keyValuePairs[prop] || 0);
      }
    }
    setSum(tmpSum);
  }; 
  
  return (
    <main>
      <div className="flex flex-col items-center">
        
        {/* <div className="bg-cover bg-center w-full h-full absolute top-0 left-0"
            style={{ backgroundImage: `url('/facade3.png')`, backgroundAttachment: 'fixed', position: 'fixed', zIndex: -1 }}>
        </div> */}

        <div className="bg-cover bg-center w-full h-full absolute top-0 left-0"
            style={{ 
                backgroundImage: `url('${imageUrl}')`, 
                // backgroundAttachment: 'fixed', 
                position: 'fixed', 
                zIndex: -1,
                // backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
            }}>
            {/* <style jsx>{`
                @media (max-width: 640px) {
                    .bg-cover {
                        background-size: contain;
                    }
                }
            `}</style> */}
        </div>

        <div className="z-20 my-40">
          <Image src="/logo3.png" alt="Logo" width={300} height={200} />
        </div>

        {/* <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-20"> */}
          <div className="card bg-base-100 shadow-xl mx-2 w-[500px] max-w-[95%]">
            <div className="card-body flex flex-col items-center">
              <h3 className="text-xl mb-5" style={{color: '#240ECA'}}>Næste åbningsdato</h3>

              {loading ? (
                <span className="loading loading-spinner" style={{color: '#240ECA'}}></span>
              ) : (
                <>
                  <h3 className="text-2xl">{nextOpening}</h3>
                  <h3 className="text-2xl">{openingTime}</h3>
                </>
              )}
            {/* </div>
          </div> */}
        {/* </div> */}

        {/* <div className="absolute top-0 left-0 w-full flex items-center justify-center z-30"> */}
        {/* <div className="card bg-base-100 shadow-xl">
        <div className="card-body"> */}
          <h3 className="mt-10 text-xl" style={{color: '#240ECA'}}>Pre-order</h3>
            <form className="flex flex-col items-center w-full">

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Navn</span>
                </div>
                <input type="text" className="input input-bordered focus:border-primary focus:outline-none w-full" value={newOrder.name} onChange={(e) => setNewOrder({...newOrder, name: e.target.value})}/>
              </label>
              
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Telefon nr.</span>
                </div>
                <input type="text" className="input input-bordered focus:border-primary focus:outline-none w-full" value={newOrder.phone} onChange={(e) => setNewOrder({...newOrder, phone: e.target.value})}/>
              </label>
              
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Forventet afhentningstidspunkt</span>
                </div>
                <input type="time" className="input input-bordered focus:border-primary focus:outline-none w-full" value={newOrder.pickup} onChange={(e) => setNewOrder({...newOrder, pickup: e.target.value})}/>
              </label>

              <div className="collapse collapse-arrow bg-base-200 mt-5">
                <input type="checkbox" name="my-accordion-2" />
                <h5 className="collapse-title text-lg font-medium">Plain boller</h5>
                <div className="collapse-content flex flex-col">

                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Plain bolle</span>
                      <span className="label-text">13 kr.</span>
                    </div>
                    {/* <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" /> */}
                    <input type="number" min={0} className="input input-bordered focus:border-primary focus:outline-none w-full" value={newOrder.plain} onChange={(e) => setNewOrder({...newOrder, plain: parseInt(e.target.value)})}/>
                  </label>
                  
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Plain bolle med smør og Vesterhavsost</span>
                      <span className="label-text">35 kr.</span>
                    </div>
                    <input type="number" min={0} className="input input-bordered focus:border-primary focus:outline-none w-full" value={newOrder.plainVHO} onChange={(e) => setNewOrder({...newOrder, plainVHO: parseInt(e.target.value)})}/>
                  </label>
                  
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Plain bolle med smør og Gammelknas</span>
                      <span className="label-text">35 kr.</span>
                    </div>
                    <input type="number" min={0} className="input input-bordered focus:border-primary focus:outline-none w-full" value={newOrder.plainGK} onChange={(e) => setNewOrder({...newOrder, plainGK: parseInt(e.target.value)})}/>
                  </label>

                </div>
              </div>

              <div className="collapse collapse-arrow bg-base-200 mt-2">
                <input type="checkbox" name="my-accordion-2" />
                <h5 className="collapse-title text-lg font-medium">Sesamboller</h5>
                <div className="collapse-content flex flex-col">

                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Sesambolle</span>
                      <span className="label-text">13 kr.</span>
                    </div>
                    {/* <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" /> */}
                    <input type="number" min={0} className="input input-bordered focus:border-primary focus:outline-none w-full" value={newOrder.sesam} onChange={(e) => setNewOrder({...newOrder, sesam: parseInt(e.target.value)})}/>
                  </label>
                  
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Sesambolle med smør og Vesterhavsost</span>
                      <span className="label-text">35 kr.</span>
                    </div>
                    <input type="number" min={0} className="input input-bordered focus:border-primary focus:outline-none w-full" value={newOrder.sesamVHO} onChange={(e) => setNewOrder({...newOrder, sesamVHO: parseInt(e.target.value)})}/>
                  </label>
                  
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Sesambolle med smør og Gammelknas</span>
                      <span className="label-text">35 kr.</span>
                    </div>
                    <input type="number" min={0} className="input input-bordered focus:border-primary focus:outline-none w-full" value={newOrder.sesamGK} onChange={(e) => setNewOrder({...newOrder, sesamGK: parseInt(e.target.value)})}/>
                  </label>

                </div>
              </div>
              
              <div className="collapse collapse-arrow bg-base-200 mt-2">
                <input type="checkbox" name="my-accordion-2" />
                <h5 className="collapse-title text-lg font-medium">Mixed seeds boller</h5>
                <div className="collapse-content flex flex-col">

                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Mixed seeds bolle</span>
                      <span className="label-text">13 kr.</span>
                    </div>
                    {/* <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" /> */}
                    <input type="number" min={0} className="input input-bordered focus:border-primary focus:outline-none w-full" value={newOrder.mixed} onChange={(e) => setNewOrder({...newOrder, mixed: parseInt(e.target.value)})}/>
                  </label>
                  
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Mixed seeds bolle med smør og Vesterhavsost</span>
                      <span className="label-text">35 kr.</span>
                    </div>
                    <input type="number" min={0} className="input input-bordered focus:border-primary focus:outline-none w-full" value={newOrder.mixedVHO} onChange={(e) => setNewOrder({...newOrder, mixedVHO: parseInt(e.target.value)})}/>
                  </label>
                  
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Mixed seeds bolle med smør og Gammelknas</span>
                      <span className="label-text">35 kr.</span>
                    </div>
                    <input type="number" min={0} className="input input-bordered focus:border-primary focus:outline-none w-full" value={newOrder.mixedGK} onChange={(e) => setNewOrder({...newOrder, mixedGK: parseInt(e.target.value)})}/>
                  </label>

                </div>
              </div>

              <div className="collapse collapse-arrow bg-base-200 mt-2">
                <input type="checkbox" name="my-accordion-2" />
                <h5 className="collapse-title text-lg font-medium">Månedens yoghurt</h5>
                <div className="collapse-content flex flex-col">

                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Søtoftegård yoghurt, rabarberkompot, granola</span>
                      <span className="label-text">65 kr.</span>
                    </div>
                    <input type="number" min={0} className="input input-bordered focus:border-blue-800 focus:outline-none w-full" value={newOrder.yoghurt} onChange={(e) => setNewOrder({...newOrder, yoghurt: parseInt(e.target.value)})}/>
                  </label>

                </div>
              </div>
              
              <div className="collapse collapse-arrow bg-base-200 my-2">
                <input type="checkbox" name="my-accordion-2" />
                <h5 className="collapse-title text-lg font-medium">Månedens sødt</h5>
                <div className="collapse-content flex flex-col">

                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">{soedt}</span>
                      <span className="label-text">36 kr.</span>
                    </div>
                    <input type="number" min={0} className="input input-bordered focus:border-blue-800 focus:outline-none w-full" value={newOrder.soedtUC} onChange={(e) => setNewOrder({...newOrder, soedtUC: parseInt(e.target.value)})}/>
                  </label>
                  
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">{soedtExtra}</span>
                      <span className="label-text">42 kr.</span>
                    </div>
                    <input type="number" min={0} className="input input-bordered focus:border-blue-800 focus:outline-none w-full" value={newOrder.soedt} onChange={(e) => setNewOrder({...newOrder, soedt: parseInt(e.target.value)})}/>
                  </label>
                  
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">{soedtAdditional}</span>
                      <span className="label-text">25 kr.</span>
                    </div>
                    <input type="number" min={0} className="input input-bordered focus:border-blue-800 focus:outline-none w-full" value={newOrder.soedtAdditional} onChange={(e) => setNewOrder({...newOrder, soedtAdditional: parseInt(e.target.value)})}/>
                  </label>

                </div>
              </div>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Kommentar</span>
                </div>
                <textarea className="textarea textarea-bordered focus:border-primary focus:outline-none w-full" value={newOrder.comment} onChange={(e) => setNewOrder({...newOrder, comment: e.target.value})}/>
              </label>

              <h3 className="mt-6">Total: {sum} kr.</h3>

              <button className="btn btn-outline hover:bg-white text-white rounded-full mb-6 mt-5" style={{color: '#240ECA'}} type="submit" onClick={addItem}>
                {loadingAdd ? (
                <span className="loading loading-spinner" style={{color: '#240ECA'}}></span>
                ) : (
                  <>
                    Bestil
                  </>
                )}
              </button>
              {showError && <p>Indtast navn og telefon nr. øverst!</p>}
              {showLove && <p>Tusind tak ❤️</p>}

            </form>
        </div>
        </div>

          <p className="mt-10 text-base text-white">
            <a href="https://maps.app.goo.gl/DpTdvbrcZi1hXmheA" target="_blank">Nørrebrogade 200A, 2200 København</a>
          </p>

          <a href="https://www.instagram.com/bageriet_aurora?igsh=anhqdmRuc2FyZWM2" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 mb-10 mt-4"
              fill="currentColor"
              style={{ color: "white" }}
              viewBox="0 0 24 24"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>

          </a>

      </div>
    </main>
  );
}
