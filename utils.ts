   const equal = '='
   const separator = '&'
   const listparams= Object.entries($routeParams).map((params) =>[params.join(equal)])
                                     .join(separator)
