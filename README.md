# VloGProcessor
Virtual Log Graph Query Processor is a web based application that provides an interface to formulate SPARQL queries and distributes the queries among individual endpoints to retrieve, integrate, and present the resulting data sets (log graph) from each hosts/endpoint.

This application contains several components:
- **SPARQL Query Editor**, This component  allows  users  to  formulate  and  execute  SPARQL queries against hosts. The query editor provides options that allow analysts to define settings for the query execution, including:
    - *Target Hosts*: a collection of endpoints which should be consid-ered in the log analysis,
    - *Knowledge bases*: a collection of internaland/or external sources of background knowledge that should beincluded in the  query execution (e.g., <a target="_blank" href="http://w3id.org/sepses/sparql">SEPSES-CSKG</a> and <a target="_blank" href="http://dbpedia.org/sparql">DBPedia</a>)
    - *Time Interval*: the time range of interest for the log analysis(i.e., start time and end time).
- **Query Parser**, this component parses the raw SPARQL syntax into a structured format to easier access the elements and variables (i.e. JSON). We use <a href="https://github.com/RubenVerborgh/SPARQL.js">SPARQL.JS</a> an open-source SPARQL query parser. 
- **Query Engine**, it use to execute SPARQL Query against the <a target="_blank" href="https://github.com/rdfhdt">RDF-HDT</a> data produced by <a target="_blank" href="https://github.com/sepses/VloGParser">Log Parser</a>. We used <a target="_blank" href="https://github.com/comunica/comunica">Comunica</a>, a modular query engine platform that supports querying over multiple heterogeneous linkeddata interfaces (e.g., HDT, File, SPARQL Endpoint, TPF, etc)
- **Visualization**, this component presents the query results (e.g. HTML table).

## Configuration

There are some configuration should be made prior running the application. Please take a look at the configuration file (public/input_hdt.json).

to add hosts/endpoint option:
```bash
    "hostEndpoint":[{
        "name":"hostEndpoint", #name of Endpoint
        "id":"hostEndpoint0", #id of endpoint
        "value":"/home/VloGraphQueryProcessor/uploads/10.5.0.2.hdt", #location of produced hdt file
        "label":"Host 1", #label of endopoint
        "checked":"checked" #default check
    }..
```
to add background knowledge:
```bash
    "bgKnowledge":[{
        "name":"bgk_file", #name of background knowledge
        "type":"file", #interface type
        "id":"eventknowledge", #id of background knowledge
        "value":"https://sepses.ifs.tuwien.ac.at/knowledge/eventKnowledge.ttl", #
        "label":"Internal Knowledge", #label of backgroud knowledge
        "checked":"" #default checked
    }..
```

## Run the Code

This project can be setup by cloning and installing and running it as follows:

```bash
$ git clone https://github.com/sepses/VloGraphQueryProcessor.git
$ cd VlogGraphQueryProcessor
$ npm install
$ npm start
```

the engine will run at [http://localhost:3000](http://localhost:3000)

## License

The Virtual Log Graph Query Processor is written by [Kabul Kurniawan](https://kabulkurniawan.github.io/) released under the [MIT license](http://opensource.org/licenses/MIT).

