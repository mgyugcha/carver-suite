import {
  Network,
  State,
  Node,
  Link,
  Table,
  RelevanceTreeInferenceFactory,
} from 'bayes-server'
const network = new Network('Tesis')

// generar las variables para el nodo a
const aForemost = new State('Foremost')
const aScalpel = new State('Scalpel')
const a = new Node('A', [aForemost, aScalpel])
// generar las variables para el nodo b
const escritorio = new State('Escritorio')
const librero = new State('Librero')
const piso2 = new State('Piso2')
const piso3 = new State('Piso3')
const piso4 = new State('Piso4')
const b = new Node('B', [escritorio, librero, piso2, piso3, piso4])
// generar las variables para el nodo c
const cLiviano = new State('Liviano')
const cMediano = new State('Mediano')
const cPesado = new State('Pesado')
const c = new Node('C', [cLiviano, cMediano, cPesado])
// generar las variables para el nodo d
const seg10 = new State('Segundo10')
const seg30 = new State('Segundo30')
const seg65 = new State('Segundo65')
const d = new Node('D', [seg10, seg30, seg65])

const volt6 = new State('Voltaje6')
const volt7 = new State('Voltaje7')
const volt8 = new State('Voltaje8')
const volt9 = new State('Voltaje9')
const volt12 = new State('Voltaje12')
const e = new Node('E', [volt6, volt7, volt8, volt9, volt12])

const seg10m = new State('Segundo10m')
const seg15m = new State('Segundo15m')
const seg20m = new State('Segundo20m')
const f = new Node('F', [seg10m, seg15m, seg20m])

// Carga de nodos a la red
network.nodes.push(a)
network.nodes.push(b)
network.nodes.push(c)
network.nodes.push(d)
network.nodes.push(e)
network.nodes.push(f)

//  Realizamos los links hacia el nodo a
network.links.push(new Link(a, b))
network.links.push(new Link(a, c))
network.links.push(new Link(a, d))
network.links.push(new Link(a, e))
network.links.push(new Link(a, f))

//  Carga de datos estadisticos en la tabla a pertenciente al nodo a
const tableA = a.newDistribution().table
tableA.set(0.636, [aForemost])
tableA.set(0.364, [aScalpel])
a.distribution = tableA //  Agregamos la distribucion de la tabla a al nodo a

//  Carga de datos estadisticos en la tabla b pertenciente al nodo b
const tableB = b.newDistribution().table
tableB.set(0.2026, [aForemost, escritorio])
tableB.set(0.1948, [aForemost, librero])
tableB.set(0.2022, [aForemost, piso2])
tableB.set(0.2002, [aForemost, piso3])
tableB.set(0.2002, [aForemost, piso4])
tableB.set(0.1861, [aScalpel, escritorio])
tableB.set(0.2217, [aScalpel, librero])
tableB.set(0.2202, [aScalpel, piso2])
tableB.set(0.1805, [aScalpel, piso3])
tableB.set(0.1915, [aScalpel, piso4])
b.distribution = tableB //  Agregamos la distribucion de la tabla b al nodo b

//  Carga de datos estadisticos en la tabla c pertenciente al nodo c
const tableC = c.newDistribution().table
tableC.set(0.3405, [aForemost, cLiviano])
tableC.set(0.3398, [aForemost, cMediano])
tableC.set(0.3197, [aForemost, cPesado])
tableC.set(0.8131, [aScalpel, cLiviano])
tableC.set(0.1774, [aScalpel, cMediano])
tableC.set(0.0095, [aScalpel, cPesado])
c.distribution = tableC //  Agregamos la distribucion de la tabla c al nodo c

//  Carga de datos estadisticos en la tabla d pertenciente al nodo d
const tableD = d.newDistribution().table
tableD.set(0.3334, [aForemost, seg10])
tableD.set(0.3328, [aForemost, seg30])
tableD.set(0.3338, [aForemost, seg65])
tableD.set(0.3347, [aScalpel, seg10])
tableD.set(0.3338, [aScalpel, seg30])
tableD.set(0.3315, [aScalpel, seg65])
d.distribution = tableD //  Agregamos la distribucion de la tabla d al nodo d

const tableE = e.newDistribution().table
tableE.set(0.3311, [aForemost, volt6])
tableE.set(0.298, [aForemost, volt7])
tableE.set(0.2649, [aForemost, volt8])
tableE.set(0.106, [aForemost, volt9])
tableE.set(0, [aForemost, volt12])
tableE.set(0.2575, [aScalpel, volt6])
tableE.set(0.2498, [aScalpel, volt7])
tableE.set(0.2472, [aScalpel, volt8])
tableE.set(0.2455, [aScalpel, volt9])
tableE.set(0, [aScalpel, volt12])
e.distribution = tableE

const tableF = f.newDistribution().table
tableF.set(0.4545, [aForemost, seg10m])
tableF.set(0.4545, [aForemost, seg15m])
tableF.set(0.091, [aForemost, seg20m])
tableF.set(0.3759, [aScalpel, seg10m])
tableF.set(0.3824, [aScalpel, seg15m])
tableF.set(0.2417, [aScalpel, seg20m])
f.distribution = tableF
// creacion de la inferencia
const arbol = new RelevanceTreeInferenceFactory()
const inferencia = arbol.createInferenceEngine(network)
const queryOptions = arbol.createQueryOptions()
const queryOutput = arbol.createQueryOutput()

// inferencia.evidence.setState(cMediano)// envio del parametro para generar la inferencia
const queryA = new Table(a) // consulta sobre que tabla se va a realizar la inferencia
inferencia.queryDistributions.pushDistribution(queryA) // realiza la inferencia a la tabla
inferencia.query(queryOptions, queryOutput)
// console.log('{' + queryA.get([aForemost]) + ',' + queryA.get([aScalpel]) + '}.')//  resultados estadisticos de la inferencia
// function inferir(inf) {
function inferir(inf) {
  inferencia.evidence.setState(inf)
  inferencia.queryDistributions.pushDistribution(queryA)
  inferencia.query(queryOptions, queryOutput)
  const valorF = queryA.get([aForemost])
  const valorS = queryA.get([aScalpel])
  return {
    valorF: valorF,
    valorS: valorS,
  }
}

function inferir2(inf, inf2) {
  inferencia.evidence.setState(inf)
  inferencia.evidence.setState(inf2)
  inferencia.queryDistributions.pushDistribution(queryA)
  inferencia.query(queryOptions, queryOutput)
  const valorF = queryA.get([aForemost])
  const valorS = queryA.get([aScalpel])
  return {
    valorF: valorF,
    valorS: valorS,
  }
}
function inferir3(inf, inf2, inf3) {
  inferencia.evidence.setState(inf)
  inferencia.evidence.setState(inf2)
  inferencia.evidence.setState(inf3)
  inferencia.queryDistributions.pushDistribution(queryA)
  inferencia.query(queryOptions, queryOutput)
  const valorF = queryA.get([aForemost])
  const valorS = queryA.get([aScalpel])
  return {
    valorF: valorF,
    valorS: valorS,
  }
}
function inferir4(inf, inf2, inf3, inf4) {
  inferencia.evidence.setState(inf)
  inferencia.evidence.setState(inf2)
  inferencia.evidence.setState(inf3)
  inferencia.evidence.setState(inf4)
  inferencia.queryDistributions.pushDistribution(queryA)
  inferencia.query(queryOptions, queryOutput)
  const valorF = queryA.get([aForemost])
  const valorS = queryA.get([aScalpel])
  return {
    valorF: valorF,
    valorS: valorS,
  }
}
function inferir5(inf, inf2, inf3, inf4, inf5) {
  inferencia.evidence.setState(inf)
  inferencia.evidence.setState(inf2)
  inferencia.evidence.setState(inf3)
  inferencia.evidence.setState(inf4)
  inferencia.evidence.setState(inf5)
  inferencia.queryDistributions.pushDistribution(queryA)
  inferencia.query(queryOptions, queryOutput)
  const valorF = queryA.get([aForemost])
  const valorS = queryA.get([aScalpel])
  return {
    valorF: valorF,
    valorS: valorS,
  }
}
// export default inferir
// export inferir2
const Pesos = {
  escritorio,
  librero,
  piso2,
  piso3,
  piso4,
  cLiviano,
  cMediano,
  cPesado,
  seg10,
  seg30,
  seg65,
  volt6,
  volt7,
  volt8,
  volt9,
  volt12,
  seg10m,
  seg15m,
  seg20m,
  inferir,
  inferir2,
  inferir3,
  inferir4,
  inferir5,
}

export default Pesos
// var result = inferir(volt9)
// console.log('Foremost: ' + result.valorF * 100)
// console.log('Scalpel: ' + result.valorS * 100)
// module.exports = inferir
