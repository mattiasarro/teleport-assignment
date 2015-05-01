require('mi')

setwd("~/Data Science/teleport/teleport-assignment/data/")
options(mc.cores = 4)

mdf <- missing_data.frame(read.csv('rent_data.csv'))
summary(mdf)
show(mdf)
hist(mdf)

mdf <- change(mdf, 
              y = c("X1br_availability", "X2br_availability", "X3br_availability", "studio_availability"), 
              what = "type", 
              to = c("count", "count", "count", "count"))
show(mdf)

imputations <- mi(mdf, n.iter = 50, n.chains = 4, max.minutes = 20)
Rhats(imputations)

imputations <- mi(imputations, n.iter = 5)
Rhats(imputations)
plot(imputations)
image(imputations)

dfs <- complete(imputations, m = 2)
write.csv(dfs, "rent_data_imputed.csv")