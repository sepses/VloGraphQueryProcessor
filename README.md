# VloGProcessor
Virtual Log Graph Query Processor is a web based application that provides an interface to formulate SPARQL queries and distributes the queries among individual endpoints to retrieve, integrate, and present the resulting data sets (log graph) from each hosts/endpoint.

This application contains several components:
- **SPARQL Query Editor**, This component is part of the QueryProcessor  that  allows  users  to  formulate  and  execute  SPARQLqueries against hosts.
- **Query Parser**, this component parses the raw SPARQL syntax into a structured format to easier access the elements and variables (i.e. JSON) .
- **Query Engine**, it use to execute SPARQL Query against the RDF-HDT data produced by Log Processor.
- **Visualization**, this component presents the query results (e.g. HTML tabel).

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

## License

The Virtual Log Graph Query Processor is written by [Kabul Kurniawan](https://kabulkurniawan.github.io/) released under the [MIT license](http://opensource.org/licenses/MIT).

