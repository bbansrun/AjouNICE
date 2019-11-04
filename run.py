from app import app
from app import database
from flask_graphql import GraphQLView

app.add_url_rule('/graphql', view_func=GraphQLView.as_view('graphql', schema=database.schema, graphiql=True))
app.run(port=5000)