def parser(qs):
    paramas = qs.split("&")
    keyValues = []
    for param in paramas:
        keyValues.append(param.split("="))
    res  = {}
    for  k,v  in keyValues:
        res[k] = v
    return res

    
