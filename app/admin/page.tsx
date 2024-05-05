'use client'
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from "../firebase";
import { useRouter } from 'next/navigation';

function sortTimes(times: any[]): any[] {
  const definedTimes = times.filter(item => item.pickup !== undefined);
  const undefinedTimes = times.filter(item => item.pickup === undefined);

  definedTimes.sort((a, b) => {
      if (a.pickup && b.pickup) {
          const [aHour, aMinute] = a.pickup.split(':').map(Number);
          const [bHour, bMinute] = b.pickup.split(':').map(Number);

          if (aHour === bHour) {
              return aMinute - bMinute;
          }
          return aHour - bHour;
      }
      return 0;
  });

  return definedTimes.concat(undefinedTimes);
}

const AdminPage = () => {

    const router = useRouter();

    const [orders, setOrders] = useState<any[]>([])
    const [doneOrders, setDoneOrders] = useState<any[]>([])
    const [nextOpening, setNextOpening] = useState('')
    const [openingTime, setOpeningTime] = useState('')
    const [soedt, setSoedt] = useState('')
    const [soedtExtra, setSoedtExtra] = useState('')
    const [soedtAdditional, setSoedtAdditional] = useState('')

    useEffect(() => {
      const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
      if (!isAuthenticated) {
          router.push('/login');
      }
    }, []);

    useEffect(() => {
        const q = query(collection(db, 'orders'))
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const itemArr: any = [];
  
          querySnapshot.forEach((doc) => {
            itemArr.push({...doc.data(), id: doc.id})
          });

          const doneList = itemArr.filter((order: any) => order.done === true)
          const restList = itemArr.filter((order: any) => !order.done)

          const doneListSorted = sortTimes(doneList);
          const restListSorted = sortTimes(restList);

          setOrders(restListSorted);
          setDoneOrders(doneListSorted);
  
          return () => unsubscribe();
        });
  
    }, [])
  
    const deleteItem = async (id: any) => {
      await deleteDoc(doc(db, 'orders', id))
    }
    
    const selectRow = async (id: any) => {
      console.log("id: ", id)
      const res = await updateDoc(doc(db, 'orders', id), {
        done: true
      })
    }
    
    const toggleSelectRow = async (event: any, id: any) => {
      console.log("id: ", id)
      console.log("event: ", event)
      if (event.target.checked === true) {
        await updateDoc(doc(db, 'orders', id), {
          done: true
        })
      }
      else if (event.target.checked === false) {
        await updateDoc(doc(db, 'orders', id), {
          done: false
        })
      }
    }



    const sums = {
      plain: orders.reduce((total, item) => total + (typeof item.plain === 'number' ? item.plain : 0), 0),
      plainVHO: orders.reduce((total, item) => total + (typeof item.plainVHO === 'number' ? item.plainVHO : 0), 0),
      plainGK: orders.reduce((total, item) => total + (typeof item.plainGK === 'number' ? item.plainGK : 0), 0),
      sesam: orders.reduce((total, item) => total + (typeof item.sesam === 'number' ? item.sesam : 0), 0),
      sesamVHO: orders.reduce((total, item) => total + (typeof item.sesamVHO === 'number' ? item.sesamVHO : 0), 0),
      sesamGK: orders.reduce((total, item) => total + (typeof item.sesamGK === 'number' ? item.sesamGK : 0), 0),
      mixed: orders.reduce((total, item) => total + (typeof item.mixed === 'number' ? item.mixed : 0), 0),
      mixedVHO: orders.reduce((total, item) => total + (typeof item.mixedVHO === 'number' ? item.mixedVHO : 0), 0),
      mixedGK: orders.reduce((total, item) => total + (typeof item.mixedGK === 'number' ? item.mixedGK : 0), 0),
      yoghurt: orders.reduce((total, item) => total + (typeof item.yoghurt === 'number' ? item.yoghurt : 0), 0),
      soedt: orders.reduce((total, item) => total + (typeof item.soedt === 'number' ? item.soedt : 0), 0),
      soedtUC: orders.reduce((total, item) => total + (typeof item.soedtUC === 'number' ? item.soedtUC : 0), 0),
      soedtAdditional: orders.reduce((total, item) => total + (typeof item.soedtAdditional === 'number' ? item.soedtAdditional : 0), 0),
    };
    
    
    const doneSums = {
      plain: doneOrders.reduce((total, item) => total + (typeof item.plain === 'number' ? item.plain : 0), 0),
      plainVHO: doneOrders.reduce((total, item) => total + (typeof item.plainVHO === 'number' ? item.plainVHO : 0), 0),
      plainGK: doneOrders.reduce((total, item) => total + (typeof item.plainGK === 'number' ? item.plainGK : 0), 0),
      sesam: doneOrders.reduce((total, item) => total + (typeof item.sesam === 'number' ? item.sesam : 0), 0),
      sesamVHO: doneOrders.reduce((total, item) => total + (typeof item.sesamVHO === 'number' ? item.sesamVHO : 0), 0),
      sesamGK: doneOrders.reduce((total, item) => total + (typeof item.sesamGK === 'number' ? item.sesamGK : 0), 0),
      mixed: doneOrders.reduce((total, item) => total + (typeof item.mixed === 'number' ? item.mixed : 0), 0),
      mixedVHO: doneOrders.reduce((total, item) => total + (typeof item.mixedVHO === 'number' ? item.mixedVHO : 0), 0),
      mixedGK: doneOrders.reduce((total, item) => total + (typeof item.mixedGK === 'number' ? item.mixedGK : 0), 0),
      yoghurt: doneOrders.reduce((total, item) => total + (typeof item.yoghurt === 'number' ? item.yoghurt : 0), 0),
      soedt: doneOrders.reduce((total, item) => total + (typeof item.soedt === 'number' ? item.soedt : 0), 0),
      soedtUC: doneOrders.reduce((total, item) => total + (typeof item.soedtUC === 'number' ? item.soedtUC : 0), 0),
      soedtAdditional: doneOrders.reduce((total, item) => total + (typeof item.soedtAdditional === 'number' ? item.soedtAdditional : 0), 0),
    };
    

    const updateDate = async (e: any) => {
      
      e.preventDefault()

      const dato = doc(db, "open", "date");
      
      await updateDoc(dato, {
        next_date: nextOpening
      });

      setNextOpening('');
    }

    const updateTime = async (e: any) => {
      e.preventDefault()

      const time = doc(db, "open", "time");
      
      await updateDoc(time, {
        open_time: openingTime
      });

      setOpeningTime('');
    }
    
    const updateSoedt = async (e: any) => {
      e.preventDefault()
      const dessert = doc(db, "menu", "dessert");
      await updateDoc(dessert, {
        soedt: soedt
      });
      setSoedt('');
    }
    
    const updateSoedtExtra = async (e: any) => {
      e.preventDefault()
      const dessert = doc(db, "menu", "dessert");
      await updateDoc(dessert, {
        soedt_extra: soedtExtra
      });
      setSoedtExtra('');
    }

    const updateSoedtAdditional = async (e: any) => {
      e.preventDefault()
      const dessert = doc(db, "menu", "dessert");
      await updateDoc(dessert, {
        additional: soedtAdditional
      });
      setSoedtAdditional('');
    }

    const isChecked = (item: any) => {
      if (item.done) return true;
      else return false;
    }

  return (
    <div>
        <h1 className='text-xl font-bold m-10'>Dashboard</h1>

        <div className='flex flex-row flex-wrap'>
          <label className="form-control w-full max-w-xs ml-10 mb-10">
            <div className="label">
              <span className="label-text">Næste åbningsdato</span>
            </div>
            <div className='flex flex-row'>
              <input type="text" className="input input-bordered focus:border-primary focus:outline-none w-full max-w-xs" value={nextOpening} onChange={(e) => setNextOpening(e.target.value)}/>
              <button className="btn btn-primary text-white ml-5" onClick={updateDate}>Gem</button>
            </div>
          </label>
          
          <label className="form-control w-full max-w-xs ml-10 mb-10">
            <div className="label">
              <span className="label-text">Åbningstidspunkt</span>
            </div>
            <div className='flex flex-row'>
              <input type="text" className="input input-bordered focus:border-primary focus:outline-none w-full max-w-xs" value={openingTime} onChange={(e) => setOpeningTime(e.target.value)}/>
              <button className="btn btn-primary text-white ml-5" onClick={updateTime}>Gem</button>
            </div>
          </label>
          
          <label className="form-control w-full max-w-xs ml-10 mb-10">
            <div className="label">
              <span className="label-text">Sødt</span>
            </div>
            <div className='flex flex-row'>
              <input type="text" className="input input-bordered focus:border-primary focus:outline-none w-full max-w-xs" value={soedt} onChange={(e) => setSoedt(e.target.value)}/>
              <button className="btn btn-primary text-white ml-5" onClick={updateSoedt}>Gem</button>
            </div>
          </label>

          <label className="form-control w-full max-w-xs ml-10 mb-10">
            <div className="label">
              <span className="label-text">Sødt (m. topping)</span>
            </div>
            <div className='flex flex-row'>
              <input type="text" className="input input-bordered focus:border-primary focus:outline-none w-full max-w-xs" value={soedtExtra} onChange={(e) => setSoedtExtra(e.target.value)}/>
              <button className="btn btn-primary text-white ml-5" onClick={updateSoedtExtra}>Gem</button>
            </div>
          </label>
          
          <label className="form-control w-full max-w-xs ml-10 mb-10">
            <div className="label">
              <span className="label-text">Mere sødt (fx cookie)</span>
            </div>
            <div className='flex flex-row'>
              <input type="text" className="input input-bordered focus:border-primary focus:outline-none w-full max-w-xs" value={soedtAdditional} onChange={(e) => setSoedtAdditional(e.target.value)}/>
              <button className="btn btn-primary text-white ml-5" onClick={updateSoedtAdditional}>Gem</button>
            </div>
          </label>

        </div>

        <h2 className='text-xl font-bold m-10'>Orders 🥐</h2>

        <div className="overflow-x-auto ml-10 mr-10">
          <table className='table table-xs table-zebra'>
            <thead>
              <tr>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <th>Navn</th>
                <th>Telf</th>
                <th>Dato</th>
                <th>Pick-up</th>
                <th>Plain</th>
                <th>Plain m. VHO</th>
                <th>Plain m. GK</th>
                <th>Sesam</th>
                <th>Sesam m. VHO</th>
                <th>Sesam m. GK</th>
                <th>Mixed</th>
                <th>Mixed m. VHO</th>
                <th>Mixed m. GK</th>
                <th>Yoghurt</th>
                <th>Sødt (-)</th>
                <th>Sødt (+)</th>
                <th>Cookie</th>
                <th>Kommentar</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((item, id) => (
                <tr key={id}>
                  <td>
                  <label>
                    <input type="checkbox" className="checkbox" checked={isChecked(item)} onChange={(e) => toggleSelectRow(e, item.id)}/>
                  </label>
                  </td>
                  <td>{item.name}</td>
                  <td>{item.phone}</td>
                  <td>{item.time}</td>
                  <td>{item.pickup}</td>
                  <td>{item.plain}</td>
                  <td>{item.plainVHO}</td>
                  <td>{item.plainGK}</td>
                  <td>{item.sesam}</td>
                  <td>{item.sesamVHO}</td>
                  <td>{item.sesamGK}</td>
                  <td>{item.mixed}</td>
                  <td>{item.mixedVHO}</td>
                  <td>{item.mixedGK}</td>
                  <td>{item.yoghurt}</td>
                  <td>{item.soedtUC}</td>
                  <td>{item.soedt}</td>
                  <td>{item.soedtAdditional}</td>
                  <td>{item.comment}</td>
                  <td>
                    <button onClick={() => deleteItem(item.id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}

              <tr className="bg-blue-300 text-white">
                <td colSpan={5}>Total</td>
                <td>{sums.plain}</td>
                <td>{sums.plainVHO}</td>
                <td>{sums.plainGK}</td>
                <td>{sums.sesam}</td>
                <td>{sums.sesamVHO}</td>
                <td>{sums.sesamGK}</td>
                <td>{sums.mixed}</td>
                <td>{sums.mixedVHO}</td>
                <td>{sums.mixedGK}</td>
                <td>{sums.yoghurt}</td>
                <td>{sums.soedtUC}</td>
                <td>{sums.soedt}</td>
                <td>{sums.soedtAdditional}</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* DONE */}

        <h2 className='text-xl font-bold m-10'>Done 🎉</h2>

        <div className="overflow-x-auto ml-10 mr-10 my-10">
          <table className='table table-xs table-zebra'>
            <thead>
              <tr>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <th>Navn</th>
                <th>Telf</th>
                <th>Dato</th>
                <th>Pick-up</th>
                <th>Plain</th>
                <th>Plain m. VHO</th>
                <th>Plain m. GK</th>
                <th>Sesam</th>
                <th>Sesam m. VHO</th>
                <th>Sesam m. GK</th>
                <th>Mixed</th>
                <th>Mixed m. VHO</th>
                <th>Mixed m. GK</th>
                <th>Yoghurt</th>
                <th>Sødt (-)</th>
                <th>Sødt (+)</th>
                <th>Cookie</th>
                <th>Kommentar</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {doneOrders.map((item, id) => (
                <tr key={id}>
                  <td>
                  <label>
                    <input type="checkbox" className="checkbox" checked={item.done} onChange={(e) => toggleSelectRow(e, item.id)}/>
                  </label>
                  </td>
                  <td>{item.name}</td>
                  <td>{item.phone}</td>
                  <td>{item.time}</td>
                  <td>{item.pickup}</td>
                  <td>{item.plain}</td>
                  <td>{item.plainVHO}</td>
                  <td>{item.plainGK}</td>
                  <td>{item.sesam}</td>
                  <td>{item.sesamVHO}</td>
                  <td>{item.sesamGK}</td>
                  <td>{item.mixed}</td>
                  <td>{item.mixedVHO}</td>
                  <td>{item.mixedGK}</td>
                  <td>{item.yoghurt}</td>
                  <td>{item.soedtUC}</td>
                  <td>{item.soedt}</td>
                  <td>{item.soedtAdditional}</td>
                  <td>{item.comment}</td>
                  <td>
                    <button onClick={() => deleteItem(item.id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}

              <tr className="bg-green-200">
                <td colSpan={5}>Total</td>
                <td>{doneSums.plain}</td>
                <td>{doneSums.plainVHO}</td>
                <td>{doneSums.plainGK}</td>
                <td>{doneSums.sesam}</td>
                <td>{doneSums.sesamVHO}</td>
                <td>{doneSums.sesamGK}</td>
                <td>{doneSums.mixed}</td>
                <td>{doneSums.mixedVHO}</td>
                <td>{doneSums.mixedGK}</td>
                <td>{doneSums.yoghurt}</td>
                <td>{doneSums.soedtUC}</td>
                <td>{doneSums.soedt}</td>
                <td>{doneSums.soedtAdditional}</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

    </div>
  )
}

export default AdminPage