   const equal = '='
   const separator = '&'
   const listparams= Object.entries($routeParams).map((params) =>[params.join(equal)])
                                     .join(separator)

   // join object
      const arrayvalue = [
        {name:'jefferson'},
        {lastname:'medina'},
        {age:36},
        {address:'cra 83c # 78-85'}
      ]

      const res = arrayvalue.reduce((before,after)=> ({...before,...after }))
      console.log(arrayvalue,res,"one object")

      // join object


      //agrupar by id
      const myarray = [ 'jefferson','manuela','diego','jefferson','manuela']
      const myobject = [
                    {
                      id:'94541178',
                      name:'jefferson',
                      lastname:'medina',
                      type:'  A'
                    },
                    {
                      id:'7845747877',
                      name:'jose',
                      lastname:'coral',
                      type:'  A'
                    },
                    {
                      id:'94541178',
                      name:'jefferson',
                      lastname:'medina',
                      type:'  A'
                    },
                    {
                      id:'94541178',
                      name:'jefferson',
                      lastname:'medina',
                      type:'  A'
                    },
                    {
                      id:'7845747877',
                      name:'jose',
                      lastname:'coral',
                      type:'  A'
                    },
               

      ]

      
      
      const lisid =  Array.from(new Set(myobject.map((idlist)=> idlist.id)))
      const resgroupby = lisid.map((id)=> (myobject.find((one)=> one.id === id)))
      console.log(myobject,resgroupby," groupby")
      //agrupar by id


      // group by with add
      const products = [
        {
          id:1,
          name:'produc 1',
          description:'mi prodcut 1',
          amount:3
        },
        {
          id:2,
          name:'produc 2',
          description:'mi prodcut 2',
          amount:5
        },
        {
          id:2,
          name:'produc 2',
          description:'mi prodcut 2',
          amount:2
        },
        {
          id:2,
          name:'produc 2',
          description:'mi prodcut 2',
          amount:9
        },
        {
          id:1,
          name:'produc 1',
          description:'mi prodcut 1',
          amount:2
        }
      ]


        const idproducts = Array.from(new Set(products.map((pro)=> pro.id)))
        const ressum = idproducts.map((idspc)=>{
             const total = products.filter((mypro)=> mypro.id === idspc)
                   .reduce((beforepro,afterbefore)=> ( Number(beforepro)+Number(afterbefore.amount)),0) 

             const currentpro = products.find((mypro)=> mypro.id === idspc)
             const resend = {
              ...currentpro,
              amount:total
             }
          return resend
        })
        
      console.log(products,ressum," products add")
      // group by with add
