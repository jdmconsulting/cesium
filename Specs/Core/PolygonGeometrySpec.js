/*global defineSuite*/
defineSuite([
         'Core/PolygonGeometry',
         'Core/BoundingSphere',
         'Core/Cartesian3',
         'Core/Cartographic',
         'Core/Ellipsoid',
         'Core/Math',
         'Core/Shapes',
         'Core/VertexFormat'
     ], function(
         PolygonGeometry,
         BoundingSphere,
         Cartesian3,
         Cartographic,
         Ellipsoid,
         CesiumMath,
         Shapes,
         VertexFormat) {
    "use strict";
    /*global jasmine,describe,xdescribe,it,xit,expect,beforeEach,afterEach,beforeAll,afterAll,spyOn,runs,waits,waitsFor*/

    it('throws without hierarchy', function() {
        expect(function() {
            return new PolygonGeometry();
        }).toThrow();
    });

    it('throws without positions', function() {
        expect(function() {
            return PolygonGeometry.fromPositions();
        }).toThrow();
    });

    it('throws with less than three positions', function() {
        expect(function() {
            return PolygonGeometry.fromPositions({ positions : [new Cartesian3()] });
        }).toThrow();
    });

    it('throws with polygon hierarchy with less than three positions', function() {
        var hierarchy = {
            positions : Ellipsoid.WGS84.cartographicArrayToCartesianArray([
                new Cartographic()
            ])
        };

        expect(function() {
            return new PolygonGeometry({ polygonHierarchy : hierarchy });
        }).toThrow();
    });

    it('throws due to duplicate positions', function() {
        var ellipsoid = Ellipsoid.UNIT_SPHERE;

        expect(function() {
            return PolygonGeometry.fromPositions({
                positions : [
                    ellipsoid.cartographicToCartesian(Cartographic.fromDegrees(0.0, 0.0, 0.0)),
                    ellipsoid.cartographicToCartesian(Cartographic.fromDegrees(0.0, 0.0, 0.0)),
                    ellipsoid.cartographicToCartesian(Cartographic.fromDegrees(0.0, 0.0, 0.0))
                ],
                ellipsoid : ellipsoid
            });
        }).toThrow();
    });

    it('throws due to duplicate hierarchy positions', function() {
        var ellipsoid = Ellipsoid.UNIT_SPHERE;
        var hierarchy = {
                positions : ellipsoid.cartographicArrayToCartesianArray([
                    Cartographic.fromDegrees(1.0, 1.0, 0.0),
                    Cartographic.fromDegrees(1.0, 1.0, 0.0),
                    Cartographic.fromDegrees(1.0, 1.0, 0.0)
                ]),
                holes : [{
                    positions : ellipsoid.cartographicArrayToCartesianArray([
                        Cartographic.fromDegrees(0.0, 0.0, 0.0),
                        Cartographic.fromDegrees(0.0, 0.0, 0.0),
                        Cartographic.fromDegrees(0.0, 0.0, 0.0)
                    ])
                }]
        };

        expect(function() {
            return new PolygonGeometry({
                polygonHierarchy : hierarchy,
                ellipsoid : ellipsoid
            });
        }).toThrow();
    });

    it('computes positions', function() {
        var p = PolygonGeometry.fromPositions({
            vertexformat : VertexFormat.POSITION_ONLY,
            positions : Ellipsoid.WGS84.cartographicArrayToCartesianArray([
                Cartographic.fromDegrees(-50.0, -50.0, 0.0),
                Cartographic.fromDegrees(50.0, -50.0, 0.0),
                Cartographic.fromDegrees(50.0, 50.0, 0.0),
                Cartographic.fromDegrees(-50.0, 50.0, 0.0)
            ]),
            granularity : CesiumMath.PI_OVER_THREE
        });

        expect(p.attributes.position.values.length).toEqual(3 * 11);
        expect(p.indices.length).toEqual(3 * 14);
    });

    it('computes all attributes', function() {
        var p = PolygonGeometry.fromPositions({
            vertexFormat : VertexFormat.ALL,
            positions : Ellipsoid.WGS84.cartographicArrayToCartesianArray([
                Cartographic.fromDegrees(-50.0, -50.0, 0.0),
                Cartographic.fromDegrees(50.0, -50.0, 0.0),
                Cartographic.fromDegrees(50.0, 50.0, 0.0),
                Cartographic.fromDegrees(-50.0, 50.0, 0.0)
            ]),
            granularity : CesiumMath.PI_OVER_THREE
        });

        expect(p.attributes.position.values.length).toEqual(3 * 11);
        expect(p.attributes.st.values.length).toEqual(2 * 11);
        expect(p.attributes.normal.values.length).toEqual(3 * 11);
        expect(p.attributes.tangent.values.length).toEqual(3 * 11);
        expect(p.attributes.binormal.values.length).toEqual(3 * 11);
        expect(p.indices.length).toEqual(3 * 14);
    });

    it('creates a polygon from hierarchy', function() {
        var hierarchy = {
            positions : Ellipsoid.WGS84.cartographicArrayToCartesianArray([
                Cartographic.fromDegrees(-124.0, 35.0, 0.0),
                Cartographic.fromDegrees(-110.0, 35.0, 0.0),
                Cartographic.fromDegrees(-110.0, 40.0, 0.0),
                Cartographic.fromDegrees(-124.0, 40.0, 0.0)
            ]),
            holes : [{
                positions : Ellipsoid.WGS84.cartographicArrayToCartesianArray([
                    Cartographic.fromDegrees(-122.0, 36.0, 0.0),
                    Cartographic.fromDegrees(-122.0, 39.0, 0.0),
                    Cartographic.fromDegrees(-112.0, 39.0, 0.0),
                    Cartographic.fromDegrees(-112.0, 36.0, 0.0)
                ]),
                holes : [{
                    positions : Ellipsoid.WGS84.cartographicArrayToCartesianArray([
                        Cartographic.fromDegrees(-120.0, 36.5, 0.0),
                        Cartographic.fromDegrees(-114.0, 36.5, 0.0),
                        Cartographic.fromDegrees(-114.0, 38.5, 0.0),
                        Cartographic.fromDegrees(-120.0, 38.5, 0.0)
                    ])
                }]
            }]
        };

        var p = new PolygonGeometry({
            vertexformat : VertexFormat.POSITION_ONLY,
            polygonHierarchy : hierarchy,
            granularity : CesiumMath.PI_OVER_THREE
        });

        expect(p.attributes.position.values.length).toEqual(3 * 14);
        expect(p.indices.length).toEqual(3 * 10);
    });

    it('creates a polygon from clockwise hierarchy', function() {
        var hierarchy = {
            positions : Ellipsoid.WGS84.cartographicArrayToCartesianArray([
                Cartographic.fromDegrees(-124.0, 35.0, 0.0),
                Cartographic.fromDegrees(-124.0, 40.0, 0.0),
                Cartographic.fromDegrees(-110.0, 40.0, 0.0),
                Cartographic.fromDegrees(-110.0, 35.0, 0.0)
            ]),
            holes : [{
                positions : Ellipsoid.WGS84.cartographicArrayToCartesianArray([
                    Cartographic.fromDegrees(-122.0, 36.0, 0.0),
                    Cartographic.fromDegrees(-112.0, 36.0, 0.0),
                    Cartographic.fromDegrees(-112.0, 39.0, 0.0),
                    Cartographic.fromDegrees(-122.0, 39.0, 0.0)
                ]),
                holes : [{
                    positions : Ellipsoid.WGS84.cartographicArrayToCartesianArray([
                        Cartographic.fromDegrees(-120.0, 36.5, 0.0),
                        Cartographic.fromDegrees(-120.0, 38.5, 0.0),
                        Cartographic.fromDegrees(-114.0, 38.5, 0.0),
                        Cartographic.fromDegrees(-114.0, 36.5, 0.0)
                    ])
                }]
            }]
        };

        var p = new PolygonGeometry({
            vertexformat : VertexFormat.POSITION_ONLY,
            polygonHierarchy : hierarchy,
            granularity : CesiumMath.PI_OVER_THREE
        });

        expect(p.attributes.position.values.length).toEqual(3 * 14);
        expect(p.indices.length).toEqual(3 * 10);
    });

    it('computes correct bounding sphere at height 0', function() {
        var ellipsoid = Ellipsoid.WGS84;
        var center = new Cartographic(0.2930215893394521, 0.818292397338644, 1880.6159971414636);
        var positions = Shapes.computeCircleBoundary(ellipsoid, ellipsoid.cartographicToCartesian(center), 10000);

        var p = PolygonGeometry.fromPositions({
            vertexFormat : VertexFormat.ALL,
            positions : positions,
            granularity : CesiumMath.PI_OVER_THREE
        });

        expect(p.boundingSphere).toEqual(BoundingSphere.fromPoints(positions));
    });

    it('computes positions extruded', function() {
        var p = PolygonGeometry.fromPositions({
            vertexFormat : VertexFormat.POSITION_ONLY,
            positions : Ellipsoid.WGS84.cartographicArrayToCartesianArray([
                Cartographic.fromDegrees(-50.0, -50.0, 0.0),
                Cartographic.fromDegrees(50.0, -50.0, 0.0),
                Cartographic.fromDegrees(50.0, 50.0, 0.0),
                Cartographic.fromDegrees(-50.0, 50.0, 0.0)
            ]),
            granularity : CesiumMath.PI_OVER_THREE,
            extrudedHeight: 30000
        });

        expect(p.attributes.position.values.length).toEqual(3 * 21 * 2);
        expect(p.indices.length).toEqual(3 * 20 * 2);
    });

    it('computes all attributes extruded', function() {
        var p = new PolygonGeometry({
            vertexFormat : VertexFormat.ALL,
            polygonHierarchy: {
                    positions : Ellipsoid.WGS84.cartographicArrayToCartesianArray([
                        Cartographic.fromDegrees(-50.0, -50.0, 0.0),
                        Cartographic.fromDegrees(50.0, -50.0, 0.0),
                        Cartographic.fromDegrees(50.0, 50.0, 0.0),
                        Cartographic.fromDegrees(-50.0, 50.0, 0.0)
                    ])},
            granularity : CesiumMath.PI_OVER_THREE,
            extrudedHeight: 30000
        });

        expect(p.attributes.position.values.length).toEqual(3 * 21 * 2);
        expect(p.attributes.st.values.length).toEqual(2 * 21 * 2);
        expect(p.attributes.normal.values.length).toEqual(3 * 21 * 2);
        expect(p.attributes.tangent.values.length).toEqual(3 * 21 * 2);
        expect(p.attributes.binormal.values.length).toEqual(3 * 21 * 2);
        expect(p.indices.length).toEqual(3 * 20 * 2);
    });

    it('creates a polygon from hierarchy extruded', function() {
        var hierarchy = {
            positions : Ellipsoid.WGS84.cartographicArrayToCartesianArray([
                Cartographic.fromDegrees(-124.0, 35.0, 0.0),
                Cartographic.fromDegrees(-110.0, 35.0, 0.0),
                Cartographic.fromDegrees(-110.0, 40.0, 0.0),
                Cartographic.fromDegrees(-124.0, 40.0, 0.0)
            ]),
            holes : [{
                positions : Ellipsoid.WGS84.cartographicArrayToCartesianArray([
                    Cartographic.fromDegrees(-122.0, 36.0, 0.0),
                    Cartographic.fromDegrees(-122.0, 39.0, 0.0),
                    Cartographic.fromDegrees(-112.0, 39.0, 0.0),
                    Cartographic.fromDegrees(-112.0, 36.0, 0.0)
                ]),
                holes : [{
                    positions : Ellipsoid.WGS84.cartographicArrayToCartesianArray([
                        Cartographic.fromDegrees(-120.0, 36.5, 0.0),
                        Cartographic.fromDegrees(-114.0, 36.5, 0.0),
                        Cartographic.fromDegrees(-114.0, 38.5, 0.0),
                        Cartographic.fromDegrees(-120.0, 38.5, 0.0)
                    ])
                }]
            }]
        };

        var p = new PolygonGeometry({
            vertexFormat : VertexFormat.POSITION_ONLY,
            polygonHierarchy : hierarchy,
            granularity : CesiumMath.PI_OVER_THREE,
            extrudedHeight: 30000
        });

        expect(p.attributes.position.values.length).toEqual(3 * 38 * 2);
        expect(p.indices.length).toEqual(3 * 22 * 2);
    });

}, 'WebGL');
