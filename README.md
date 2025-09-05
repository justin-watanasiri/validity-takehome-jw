# validity-takehome-jw

My tests are broken down into negative and positive tests. Tests could also be organized around areas of the feature for more complex features.

Tests are not exhaustive (did not automate all of my manual workflows) but serve to demonstrate my approach.

Modularity and re-usability is achieved by leveraging functions that can be re-used.
This approach also keeps tests clean and concise. Tests were also kept narrow in scope to avoid lengthy workflows.

No hard-coded waits were used. Instead we wait for elements to be visible. I also added a cy.intercept to spy on the operations 
I predict will cause the most flake (making dropdown selections). 

We could also fully stub certain workflows but before doing that I'd want to 
actually see how the feature behaves so I can do so in a way that minimizes flake while still producing thorough tests.